# Reviews Web Application Backend

This backend repository powers the Reviews web application, which enables users to search for businesses and read reviews posted by other users. It handles all data management and server-side logic, ensuring efficient and secure processing of user requests.

## Features

- User authentication and management.
- Business information handling and reviews management.
- Google authentication integration.
- Image uploading functionality with Cloudinary.
- API endpoints to support frontend operations.

## Technologies

- **Node.js**: Runtime environment.
- **Express**: Web application framework.
- **MongoDB**: Database.
- **Mongoose**: MongoDB object modeling tool.
- **Cloudinary**: Cloud service for image storage.
- **JWT**: For secure transmission of information as JSON objects.
- **Bcrypt.js**: Library for hashing and salting user passwords.

## Setup

1. Clone the backend repository:
   ```bash
   git clone [backend-repository-url]
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up necessary environment variables in a `.env` file:
   ```
   DB_URI=your_database_uri
   JWT_SECRET=your_jwt_secret
   CLOUD_NAME=your_cloudinary_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   ```
4. To start the server:
   ```bash
   npm run start
   ```

## Usage

The backend server runs on localhost by default. Connect via the frontend or use tools like Postman for API testing and interactions.

## Contributing

Contributions to improve the backend are welcome. Please fork the repository, create a new branch for your changes, and submit a pull request.

## License

[MIT](https://choosealicense.com/licenses/mit/)
