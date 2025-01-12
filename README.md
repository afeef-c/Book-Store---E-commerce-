# Book Selling Application - Flipkart-like Experience

This is a full-stack Book Selling (Book store) Application that mimics a simplified version of Flipkart with user preferences, book recommendations, and a streamlined e-commerce workflow. The application includes features such as dynamic recommendations, shopping cart functionality, and order tracking.

## Features Implemented

### 1. **User Preferences**
   - **Like/Dislike Functionality**: Users can "like" or "dislike" books to express their preferences.
   - **Prevention of Duplicate Preferences**: A user cannot "like" and "dislike" the same book.

### 2. **Book Recommendations**
   - **Recommendations Based on Preferences**:
     - Recommends books from genres the user has liked.
     - Excludes books that the user has already interacted with (liked or disliked).
     - Adds one random suggestion outside their preferred genres to encourage variety.
   - **Fallback for No Preferences**:
     - Displays the 5 most recently added books if the user has no recorded preferences.

### 3. **Shopping Cart & Checkout Workflow**
   - **Add to Cart**: Users can add books to their cart, and the total cost is displayed dynamically.
   - **Checkout Process**: A simple form for users to enter their address, phone number, and payment method.
   - **Payment Options**: Supports Cash on Delivery (COD).
   - **Order Tracking**: Users can track their order status: "Order Placed," "Shipped," and "Delivered."

### 4. **Authentication & Role-Based Access**
   - Users can sign up and log in.
   - Admins have access to add, edit, and delete books.

### 5. **Search & Filter Options**
   - Search books by title, author, genre, or price range.

## Tech Stack

- **Backend**: Django (Python)
- **Frontend**: React.js
- **State Management**: Redux Toolkit
- **Database**: PostgreSQL
- **Cloud Storage**: AWS S3 (for storing book images)
- **Authentication**: JWT (JSON Web Token)

## Setup and Installation

### Prerequisites

Ensure the following are installed on your machine:
- Python 3.x
- Node.js
- PostgreSQL
- AWS account (for S3 storage)

### 1. Clone the Repository

Clone the project to your local machine:

```bash
git clone https://github.com/afeef-c/Book-Store---E-commerce-.git
cd Book-Store---E-commerce-


Live Application Link: https://book-store-e-commerce.onrender.com