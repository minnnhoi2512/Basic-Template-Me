# Basic-Template-Me
A series of beautiful and practical templates backend for initiator project


Here is for Express + TypeScript + ORM (MongoDB)

Model declare Object for MongoDB
Repository will take response to communicate with database
Controller call Repository do function from request, and return response
Route include Controller, user access through call route
App implement route

Database connect for Mongo Atlas

Constant have statusCode ,...

Enum have special type for variables

Interface for response data (for logic), different with model (for database)

Middleware for authentication, authorization

Util for utilization function example : changeTime, importExcel,...

.env {
    PORT = YOUR_PORT
    MONGO_URL = YOUR_MONGO_URL
}

Cluster for worker
Index for mongoose