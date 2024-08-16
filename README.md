# True Films

## [See the App!](https://truefilms.netlify.app/)

![App Logo](https://truefilms.netlify.app/assets/portada-Dm_TWCLL.png)

## Description

This site is dedicated to movie reviews and critiques. I created it to provide a platform for film enthusiasts to explore detailed reviews and ratings. The design focuses on a clean and modern look, making it easy for users to navigate and find the information they need.

#### https://github.com/ivanballester/OlimpoCinematografico-client
#### https://github.com/ivanballester/OlimpoCinematografico-server

## Backlog Functionalities

- **More Films**: Expand the database to include a larger collection of films.
- **Enhanced Film Information**: Provide more detailed information about each film, such as cast, crew, trailers, and behind-the-scenes content.
- **User-Generated Reviews**: Allow more users to sign up and create reviews, turning the platform into a social space for film critics.
- **Social Media Integration**: Enable features like following other reviewers, commenting on reviews, and sharing reviews on social media platforms.
- **Rating System**: Implement a more sophisticated rating system, allowing users to rate films on multiple criteria (e.g., acting, directing, screenplay).
- **Recommendation Engine**: Add a feature to recommend films based on user preferences and past reviews.
- **Advanced Search and Filters**: Improve the search functionality with advanced filters (e.g., genre, release date, rating).
- **User Profiles**: Create customizable user profiles where reviewers can showcase their favorite films, ratings, and review history.

## Technologies and Libraries Used


- **JavaScript (JS)** - For adding interactivity and dynamic functionality.
- **React** - A JavaScript library for building user interfaces.
- **Express.js** - A web application framework for Node.js to handle backend routing and server-side logic.
- **Node.js** - A JavaScript runtime for executing server-side code.
- **MongoDB** - A NoSQL database for storing and managing application data.
- **MongoDB Atlas** - A cloud-hosted service for managing and scaling MongoDB databases.
- **Postman** - A tool for testing and documenting APIs, used for backend API development and testing.


# Server Structure

## Models

User model

```javascript
{
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    photo: String,
    phoneNumber: Number,
    city: String,
  }
```

Review model

```javascript
 {
    text: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  }
```

Comment model

```javascript
  {
    text: { type: String, required: [true, "Text required"] },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    review: { type: Schema.Types.ObjectId, ref: "Review", required: true },
    rating: { type: Number, min: 1, max: 5 },
  }
```

## API Endpoints

| HTTP Method | Endpoint                   | Success Status | Error Status                   | Description                                       |
| ----------- | -------------------------- | -------------- | ------------------------------ | ------------------------------------------------- |
| GET         | `/comments`                | 200 OK         | 404 Not Found                  | Retrieve a list of all comments.                  |
| GET         | `/profile`                 | 200 OK         | 401 Unauthorized, 404 Not Found | Retrieve the logged-in user's profile information.|
| GET         | `/reviews`                 | 200 OK         | 404 Not Found                  | Retrieve a list of all reviews.                   |
| GET         | `/reviews/:id`             | 200 OK         | 404 Not Found                  | Retrieve details of a specific review by ID.      |
| GET         | `/reviews/:id/comments`    | 200 OK         | 404 Not Found                  | Retrieve comments for a specific review by ID.    |
| GET         | `/users`                   | 200 OK         | 404 Not Found                  | Retrieve a list of all users.                     |
| GET         | `/verify`                  | 200 OK         | 401 Unauthorized               | Verify the user's authentication status.          |
| POST        | `/signup`                  | 201 Created    | 400 Bad Request, 409 Conflict  | Create a new user account.                        |
| POST        | `/login`                   | 200 OK         | 401 Unauthorized               | Authenticate a user and log them in.              |
| POST        | `/reviews/:id/comments`    | 201 Created    | 400 Bad Request, 404 Not Found | Add a comment to a specific review by ID.         |
| POST        | `/reviews`                 | 201 Created    | 400 Bad Request                | Create a new review.                              |
| PATCH       | `/profile`                 | 200 OK         | 400 Bad Request, 401 Unauthorized | Update the logged-in user's profile.              |
| PATCH       | `/reviews/:id`             | 200 OK         | 400 Bad Request, 404 Not Found | Update details of a specific review by ID.        |
| DELETE      | `/profile`                 | 204 No Content | 400 Bad Request, 401 Unauthorized | Delete the logged-in user's profile.              |
| DELETE      | `/reviews/:id`             | 204 No Content | 400 Bad Request, 404 Not Found | Delete a specific review by ID.                   |
| DELETE      | `/users/:id`               | 204 No Content | 400 Bad Request, 404 Not Found | Delete a specific user by ID.                     |

  
## Links


### Project

[Repository Link Client](https://github.com/ivanballester/OlimpoCinematografico-client)

[Repository Link Server](https://github.com/ivanballester/OlimpoCinematografico-server)

[Deploy Link](https://truefilms.netlify.app/)



### Slides

[Slides Link](www.your-slides-url-here.com)
