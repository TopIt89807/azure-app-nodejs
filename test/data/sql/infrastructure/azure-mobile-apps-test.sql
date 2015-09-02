USE [master]
GO

DROP DATABASE [azure-mobile-apps-test]
GO

CREATE DATABASE [azure-mobile-apps-test]
GO

USE [azure-mobile-apps-test]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[integration](
	[id] [varchar](50) NOT NULL,
	[string] [varchar](50) NULL,
	[number] [float] NULL,
	[bool] [bit] NULL,
 CONSTRAINT [PK_integration] PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF)
)

GO
/****** Object:  Table [dbo].[query]    Script Date: 6/23/2015 3:36:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[query](
	[id] [varchar](50) NOT NULL,
	[string] [varchar](50) NULL,
	[number] [float] NULL,
	[bool] [bit] NULL,
 CONSTRAINT [PK_query] PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF)
)

GO

INSERT [dbo].[query] ([id], [string], [number], [bool]) VALUES (N'1', N'one', 1, 1)
GO
INSERT [dbo].[query] ([id], [string], [number], [bool]) VALUES (N'2', N'two', 2, 0)
GO
INSERT [dbo].[query] ([id], [string], [number], [bool]) VALUES (N'3', N'three', 3, 1)
GO
INSERT [dbo].[query] ([id], [string], [number], [bool]) VALUES (N'4', N'four', 4, 0)
GO
INSERT [dbo].[query] ([id], [string], [number], [bool]) VALUES (N'5', N'five', 5, 1)
GO
INSERT [dbo].[query] ([id], [string], [number], [bool]) VALUES (N'6', N'six', 6, 0)
GO
