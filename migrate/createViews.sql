DECLARE @schema nvarchar(255),@name nvarchar(255),@column nvarchar(255),@columnSQL nvarchar(1023),@SQL nvarchar(1023)

/* Iterate through all tables that contain __ prefixed system property columns */
DECLARE tableCursor CURSOR FORWARD_ONLY FOR
SELECT TABLE_SCHEMA,TABLE_NAME
    FROM information_schema.columns 
    WHERE COLUMN_NAME IN ('__version', '__createdAt', '__updatedAt', '__deleted')
    GROUP BY TABLE_SCHEMA,TABLE_NAME
    HAVING COUNT(*) = 4
OPEN tableCursor
FETCH NEXT FROM tableCursor
    INTO @schema,@name
WHILE @@FETCH_STATUS = 0
BEGIN
    /* Get comma separated list of non-system property columns */
    SET @columnSQL = NULL
    SELECT @columnSQL = COALESCE(@columnSQL + ',', '') + COLUMN_NAME 
            FROM information_schema.columns 
            WHERE TABLE_SCHEMA = @schema AND TABLE_NAME = @name AND COLUMN_NAME NOT IN ('__version', '__createdAt', '__updatedAt', '__deleted')

    /* Drop view if already exists */
    SET @SQL = 'DROP VIEW ' + @schema + '.' + @name + '_view'
    EXEC (@SQL)

    /* Create view with mapped system property columns */
    SET @SQL =  'CREATE VIEW ' + @schema + '.' + @name + '_view AS ' + 
                'SELECT '+ @columnSql + ',__createdAt AS createdAt,__updatedAt AS updatedAt,__version AS version,__deleted AS deleted ' + 
                'FROM ' + @schema + '.' + @name
    PRINT @SQL
    EXEC (@SQL)
    
    FETCH NEXT FROM tableCursor
    INTO @schema,@name
END
CLOSE tableCursor
DEALLOCATE tableCursor