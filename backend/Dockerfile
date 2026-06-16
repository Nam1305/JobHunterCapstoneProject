FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY JobHunter_V1.slnx ./
COPY JobHunter.Domain/JobHunter.Domain.csproj JobHunter.Domain/
COPY JobHunter.Service/JobHunter.Service.csproj JobHunter.Service/
COPY JobHunter.WebAPI/JobHunter.WebAPI.csproj JobHunter.WebAPI/
RUN dotnet restore JobHunter.WebAPI/JobHunter.WebAPI.csproj

COPY . .
RUN dotnet publish JobHunter.WebAPI/JobHunter.WebAPI.csproj \
  --configuration Release \
  --no-restore \
  --output /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish ./

EXPOSE 8080

ENTRYPOINT ["dotnet", "JobHunter.WebAPI.dll"]
