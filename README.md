# AI Image Generation Application

A full-stack web application that leverages OpenAI's DALL-E API to generate AI-powered images from text prompts. Users can create imaginative images and share them with the community in a beautiful, modern interface.

## 🌐 Live Application

**Application URL:** http://ai-image-gen-alb-784972051.eu-west-2.elb.amazonaws.com

*Note: The application is deployed on AWS using an Application Load Balancer (ALB). For production use, configure a custom domain with Route 53.*

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)

## 🎯 Overview

This application provides a seamless platform for generating AI images using OpenAI's DALL-E 3 model. Users enter descriptive text prompts, generate unique images, and share their creations with the community. The application features a responsive UI, image storage via Cloudinary, and a MongoDB database for storing user-generated content.

## ✨ Features

- **AI Image Generation**: Generate high-quality images using OpenAI's DALL-E 3
- **Community Gallery**: Browse and view images created by all users
- **Image Storage**: Automatic cloud storage using Cloudinary
- **Responsive Design**: Modern, mobile-friendly UI with dark mode support
- **Prompt Suggestions**: Random prompt generator for inspiration
- **Image Sharing**: Share generated images with the community
- **Real-time Preview**: See generated images before sharing

## 🛠 Technology Stack

### Frontend
- **React 18.3.1** - UI framework
- **React Router DOM 7.0.1** - Client-side routing
- **Vite 7.1.6** - Build tool and dev server
- **Tailwind CSS 3.4.15** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - Runtime environment
- **Express 4.21.1** - Web framework
- **MongoDB with Mongoose 8.8.3** - Database and ODM
- **OpenAI API 4.73.1** - DALL-E 3 integration
- **Cloudinary 2.5.1** - Image storage and management

### DevOps & Infrastructure
- **AWS ECS** - Container orchestration
- **AWS EC2** - Compute instances
- **AWS ALB** - Application Load Balancer
- **AWS ECR** - Docker image registry
- **AWS Route53** - DNS management
- **Terraform** - Infrastructure as Code
- **GitHub Actions** - CI/CD pipeline
- **Docker** - Containerization

### Tools
- **Jest** - Testing framework
- **ESLint** - Code linting
- **nodemon** - Development auto-reload

## 🏗 Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Cloud                             │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │            Route 53 (DNS)                          │    │
│  │         your-domain.com                            │    │
│  └─────────────────┬──────────────────────────────────┘    │
│                    │                                          │
│                    ▼                                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │     Application Load Balancer (HTTPS)              │    │
│  │     - SSL/TLS termination                          │    │
│  │     - Health checks                                │    │
│  └────────────┬───────────────────┬───────────────────┘    │
│               │                   │                          │
│               ▼                   ▼                          │
│  ┌──────────────────┐   ┌──────────────────┐               │
│  │  Frontend Tasks  │   │  Backend Tasks   │               │
│  │  (React App)     │   │  (Express API)   │               │
│  │  Port: 80        │   │  Port: 8000      │               │
│  │                  │   │                  │               │
│  │  - 2+ instances  │   │  - 2+ instances  │               │
│  │  - Auto-scaling  │   │  - Auto-scaling  │               │
│  └──────────────────┘   └────────┬─────────┘               │
│                                  │                          │
│                                  ▼                          │
│  ┌────────────────────────────────────────────┐            │
│  │         ECS Cluster (EC2 Instances)        │            │
│  │  - Auto Scaling Group                      │            │
│  │  - Min: 1, Max: 10, Desired: 2            │            │
│  └────────────────────────────────────────────┘            │
│                                                              │
│  ┌────────────────────────────────────────────┐            │
│  │   VPC (10.0.0.0/16)                        │            │
│  │   - Public Subnets (Multi-AZ)              │            │
│  │   - Internet Gateway                       │            │
│  │   - Security Groups                        │            │
│  └────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘

        │                              │                         │
        ▼                              ▼                         ▼
┌───────────────┐            ┌──────────────┐         ┌─────────────────┐
│   MongoDB     │            │  Cloudinary  │         │   OpenAI API    │
│  (External)   │            │  (CDN)       │         │    DALL-E 3     │
└───────────────┘            └──────────────┘         └─────────────────┘
```

### Application Flow

```
┌──────────┐    HTTP Request     ┌──────────────┐
│          │─────────────────────▶│              │
│  User    │                     │    React     │
│ Browser  │                     │  Frontend    │
│          │◀────────────────────│   (Port 80)  │
└──────────┘    HTML/CSS/JS      └──────┬───────┘
                                        │
                                        │ API Calls
                                        ▼
                                ┌───────────────┐
                                │  Express API  │
                                │  (Port 8000)  │
                                └───────┬───────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
            ┌───────────┐      ┌──────────────┐    ┌─────────────┐
            │  MongoDB  │      │  Cloudinary  │    │  OpenAI API │
            │           │      │  (Images)    │    │  (DALL-E 3) │
            └───────────┘      └──────────────┘    └─────────────┘
```

### Component Flow

```
Home Page
├── Fetch all posts from MongoDB via API
└── Display gallery of shared images

Create Post Page
├── Enter name and prompt
├── Click "Generate" button
│   ├── Call DALL-E API via backend
│   ├── Receive generated image URL
│   └── Display preview
└── Click "Share with community"
    ├── Upload image to Cloudinary
    └── Save post to MongoDB
```

### Infrastructure Components

1. **ECS Cluster**: Managed container orchestration
2. **EC2 Instances**: Compute capacity for containers
3. **Application Load Balancer**: Distributes traffic and handles SSL
4. **ECR**: Stores Docker images
5. **VPC**: Isolated network environment
6. **Route53**: DNS management and domain routing
7. **Auto Scaling**: Automatic scaling based on demand

### CI/CD Pipeline

```
┌──────────────────────────────────────────────────┐
│         GitHub Actions Workflow                  │
├──────────────────────────────────────────────────┤
│  1. Code Push/Pull Request                       │
│     │                                              │
│     ├─▶ 2. Build & Test Client (Jest)            │
│     ├─▶ 3. Build & Test Server (Jest)            │
│     │                                              │
│     ├─▶ 4. Build Docker Images                   │
│     │   ├─ Frontend: React App                   │
│     │   └─ Backend: Node.js/Express              │
│     │                                              │
│     ├─▶ 5. Push to AWS ECR                       │
│     │                                              │
│     └─▶ 6. Terraform Apply (if main branch)      │
│         ├─ Update ECS Services                   │
│         ├─ Deploy new containers                 │
│         └─ Health checks                         │
└──────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB database (local or Atlas)
- OpenAI API key
- Cloudinary account
- AWS account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AiImageGen
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   
   # Install server dependencies
   cd server
   npm install
   cd ..
   ```

3. **Environment Setup**

   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URL=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=http://localhost:5173
   ```

4. **Run the application**

   **Start the server:**
   ```bash
   cd server
   npm run dev  # Uses nodemon for auto-reload
   # or
   npm start    # Production mode
   ```

   **Start the client (in a new terminal):**
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Health Check: http://localhost:8000/health

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Client Tests Only
```bash
npm run test:client
```

### Server Tests Only
```bash
npm run test:server
```

### Test Coverage
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm run test:watch
```

## 📁 Project Structure

```
AiImageGen/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Card.jsx
│   │   │   ├── FormField.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── DarkmodeButton.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   └── CreatePost.jsx
│   │   ├── layout/           # Layout components
│   │   ├── router/           # Routing configuration
│   │   ├── assets/           # Static assets
│   │   ├── config/           # Configuration
│   │   ├── utils/            # Utility functions
│   │   └── App.jsx
│   ├── public/               # Public assets
│   ├── dist/                 # Build output
│   ├── dockerfile            # Docker configuration
│   └── package.json
├── server/                   # Node.js backend
│   ├── routes/               # API routes
│   │   ├── DalleRoute.js     # DALL-E image generation
│   │   └── PostRoute.js      # Post CRUD operations
│   ├── mongodb/
│   │   ├── connect.js        # Database connection
│   │   └── models/
│   │       └── post.js       # MongoDB schema
│   ├── dockerfile            # Docker configuration
│   ├── index.js              # Server entry point
│   └── package.json
├── terraform/                # Infrastructure as Code
│   ├── modules/              # Reusable Terraform modules
│   │   ├── alb/              # Load Balancer
│   │   ├── ecr/              # Container Registry
│   │   ├── ecs-cluster/      # ECS Cluster
│   │   ├── ecs-service/      # ECS Services
│   │   ├── iam-role/         # IAM Roles
│   │   ├── networking/       # VPC & Networking
│   │   └── route53/          # DNS Management
│   ├── main.tf               # Main configuration
│   ├── variables.tf          # Variable definitions
│   ├── outputs.tf            # Output values
│   └── terraform.tfvars      # Variable values
├── .github/
│   └── workflows/            # CI/CD pipelines
│       ├── image-gen.yml     # Main pipeline
│       └── upload-artifact.yml
├── jest.config.js            # Jest configuration
└── package.json              # Root package.json
```

## 🔧 Environment Variables

### Server (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017/aiimagegen` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-secret` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Client (.env)

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API URL |

## 🚢 Deployment

### AWS Deployment with Terraform

1. **Configure AWS credentials**
   ```bash
   aws configure
   ```

2. **Set Terraform variables**
   ```bash
   cd terraform
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your values
   ```

3. **Initialize Terraform**
   ```bash
   terraform init
   ```

4. **Plan deployment**
   ```bash
   terraform plan
   ```

5. **Apply infrastructure**
   ```bash
   terraform apply
   ```

6. **Get deployment outputs**
   ```bash
   terraform output
   ```

### Manual Docker Deployment

```bash
# Build and push images
cd client && docker build -t ai-image-gen-frontend .
cd ../server && docker build -t ai-image-gen-backend .

# Tag and push to ECR
aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.eu-west-2.amazonaws.com
docker tag ai-image-gen-frontend:latest <account-id>.dkr.ecr.eu-west-2.amazonaws.com/ai-gen-app-frontend:latest
docker push <account-id>.dkr.ecr.eu-west-2.amazonaws.com/ai-gen-app-frontend:latest
```

## 📊 Monitoring

- **Health Endpoint**: `/health` - Check server status
- **CloudWatch Logs**: View application logs in AWS CloudWatch
- **ECS Service Metrics**: Monitor CPU, memory, and task count
- **ALB Metrics**: Monitor request count and latency

## 🔐 Security Features

- CORS enabled for specific origins
- Environment variables for sensitive data
- AWS Secrets Manager integration
- Security groups for network isolation
- SSL/TLS termination at ALB
- Container image scanning in ECR

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Kieran**
- Built with ❤️

## 🙏 Acknowledgments

- OpenAI for the DALL-E API
- Cloudinary for image storage
- AWS for cloud infrastructure
- The open-source community

---

**Status**: ✅ Production Ready

For questions or support, please open an issue in the repository.
