# eClassroom

eClassroom is a web application designed to facilitate assignment management for teachers and students. It allows teachers to create, delete, read, and grade assignments, while students can read assignments and upload completed files. The application leverages AWS S3 and CloudFront for secure storage and retrieval of user-submitted documents.

## Features

- User Roles: The application supports two user roles: teachers and students. Each role has specific functionalities and permissions.
- Assignment Management: Teachers can create assignments, delete them, and track student submissions. Students can view assignments and upload completed assignments in any file format.
- User Authentication: The application implements a user authorization system, ensuring secure access to appropriate functionalities based on the user type.
- User-Friendly Interface: The web app is built with a clean and minimal UI using Bootstrap 5 and EJS, providing an intuitive and visually appealing user experience.
- Data Storage: User-submitted documents are securely stored and retrieved using AWS S3 and CloudFront.
- MVC Architecture: The application follows the Model-View-Controller (MVC) architectural pattern, enhancing code organization and maintainability.
- Technologies Used: Node.js, Express.js, MongoDB, Mongoose, Bootstrap5, Passport.js, HTML, CSS, and JavaScript.

## Installation

1. Clone the repository: `git clone https://github.com/thefaraazkhan/eClassroom.git`
2. Install dependencies: `npm install`
3. Configure AWS and Atlas credentials in the .env file by adding your details in the below variables: 
- PORT={port_number}
- DB_URL="YOUR_MONGO_ATLAS_CONNECTION_STRING"
- ACCESS_KEY="YOUR_ACCESS_KEY"
- SECRET_ACCESS_KEY="YOUR_SECRET"
- BUCKET_NAME="AWS_BECKET_NAME"
- BUCKET_REGION="AWS_REGION" (i.e ap-south-1)

4. Start the server: `npm start`
5. Access the application at `http://localhost:{PORT}`.

## Usage

1. Create an account as a teacher or a student.
2. Log in to access your respective functionalities.
3. Teachers can create assignments, delete them, and view student submissions. Students can view assignments and upload completed files.
4. Enjoy the streamlined assignment management process!

## Contributors

- [Fahad Mapari](https://github.com/fahadmapari)

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to submit a pull request or open an issue.


