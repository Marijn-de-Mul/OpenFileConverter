﻿FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 7195

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["OpenFileConverter.SAL/OpenFileConverter.SAL.csproj", "OpenFileConverter.SAL/"]
RUN dotnet restore "OpenFileConverter.SAL/OpenFileConverter.SAL.csproj"

COPY ["OpenFileConverter.DAL/OpenFileConverter.DAL.csproj", "OpenFileConverter.DAL/"]
RUN dotnet restore "OpenFileConverter.DAL/OpenFileConverter.DAL.csproj"

COPY ["OpenFileConverter.API/OpenFileConverter.API.csproj", "OpenFileConverter.API/"]
RUN dotnet restore "OpenFileConverter.API/OpenFileConverter.API.csproj"

COPY . .

WORKDIR "/src/OpenFileConverter.API"
RUN dotnet build "OpenFileConverter.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "OpenFileConverter.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OpenFileConverter.API.dll"]