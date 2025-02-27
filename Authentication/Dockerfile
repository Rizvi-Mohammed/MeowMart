# Use the official Maven image to build the WAR file
FROM maven:3.8.5-openjdk-8 as build
WORKDIR /app

# Copy the Maven POM and source files
COPY pom.xml .
COPY src ./src
COPY WebContent ./WebContent

# Build the WAR file
RUN mvn clean package

# Use the official Tomcat image to deploy the WAR file
FROM tomcat:9.0.98-jdk8
WORKDIR /usr/local/tomcat/webapps/

# Copy the built WAR file from the previous stage
COPY --from=build /app/target/*.war Authentication.war

# Expose Tomcat port
EXPOSE 8080

# Start Tomcat server
CMD ["catalina.sh", "run"]
