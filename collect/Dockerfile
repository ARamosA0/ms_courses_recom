# because of dotnet, we always build on amd64, and target platforms in cli
# dotnet doesn't support QEMU for building or running. 
# (errors common in arm/v7 32bit) https://github.com/dotnet/dotnet-docker/issues/1537
# https://hub.docker.com/_/microsoft-dotnet
# hadolint ignore=DL3029
# to build for a different platform than your host, use --platform=<platform>
# for example, if you were on Intel (amd64) and wanted to build for ARM, you would use:
# docker buildx build --platform "linux/arm64/v8" .


# FROM --platform=${BUILDPLATFORM} mcr.microsoft.com/dotnet/sdk:7.0 as build
# ARG TARGETPLATFORM
# ARG TARGETARCH
# ARG BUILDPLATFORM
# RUN echo "I am running on $BUILDPLATFORM, building for $TARGETPLATFORM"
#
# WORKDIR /source
# COPY *.csproj .
# RUN dotnet restore -a $TARGETARCH
#
# COPY . .
# RUN dotnet publish -c release -o /app -a $TARGETARCH --self-contained false --no-restore
#
# # app image
# FROM mcr.microsoft.com/dotnet/runtime:7.0
# WORKDIR /app
# COPY --from=build /app .
# ENTRYPOINT ["dotnet", "Worker.dll"]pp", "-b", "0.0.0.0:80", "--log-file", "-", "--access-logfile", "-", "--workers", "4", "--keep-alive", "0"]

# Utiliza una imagen de ASP.NET Core como base
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["collect.csproj", "."]
RUN dotnet restore "./collect.csproj"
RUN dotnet add package Confluent.Kafka
COPY . .
WORKDIR "/src/."
RUN dotnet build "collect.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "collect.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "collect.dll"]
