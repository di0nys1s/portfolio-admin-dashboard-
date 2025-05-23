# 📁 Portfolio Admin Dashboard

A modern, full-stack portfolio management application built with Next.js, TypeScript, GraphQL, and MongoDB. Easily manage your professional portfolio projects and work experience through an intuitive admin dashboard.

## ✨ Features

### 🎯 **Portfolio Management**

- ✅ Create, edit, and delete portfolio projects
- ✅ Add project details (title, description, technologies, URLs)
- ✅ Mark projects as featured
- ✅ Upload project images
- ✅ Technology tagging system

### 💼 **Work Experience Tracking**

- ✅ Manage professional work history
- ✅ Track current and past positions
- ✅ Automatic duration calculation
- ✅ Location and company information
- ✅ Technology skills per role

### 📊 **Dynamic Dashboard**

- ✅ Real-time statistics overview
- ✅ Live project and experience counts
- ✅ Featured projects percentage
- ✅ Technology aggregation
- ✅ Mobile-responsive design

### 🛠️ **Developer Experience**

- ✅ Type-safe GraphQL API
- ✅ Form validation with Zod
- ✅ Modern UI with shadcn/ui
- ✅ Dynamic metadata generation
- ✅ Error handling and loading states

## 🚀 Tech Stack

### **Frontend**

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **State Management**: Apollo Client

### **Backend**

- **API**: GraphQL (Apollo Server)
- **Database**: MongoDB with Mongoose
- **Runtime**: Node.js
- **Package Manager**: Bun

### **Key Libraries**

- `@apollo/client` - GraphQL client
- `@apollo/server` - GraphQL server
- `mongoose` - MongoDB ODM
- `react-hook-form` - Form management
- `zod` - Schema validation
- `lucide-react` - Icons
- `class-variance-authority` - Component variants

## 🔧 Prerequisites

Before running this project, make sure you have:

- **Node.js** 18+ or **Bun** runtime
- **MongoDB** database (local or cloud)
- **Git** for version control

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd my-portfolio-app
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/portfolio
   # or your MongoDB Atlas connection string
   ```

4. **Start MongoDB**

   ```bash
   # If using local MongoDB
   brew services start mongodb-community
   # or
   mongod
   ```

5. **Run the development server**

   ```bash
   bun dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### **Getting Started**

1. Visit the homepage at `/`
2. Click "Go to Dashboard" to access the admin panel
3. Start adding your portfolio projects and work experience

### **Managing Projects**

- **Add Project**: Fill out the form on the left side of the dashboard
- **View Projects**: See all projects in the gallery on the right
- **Edit/Delete**: Use the action buttons on each project card
- **Feature Projects**: Check the "Featured Project" checkbox

### **Managing Experience**

- **Add Experience**: Use the experience form in the bottom section
- **Current Jobs**: Check "I currently work here" for ongoing positions
- **View Timeline**: All experiences appear in chronological order
- **Duration**: Automatic calculation of time spent at each position

### **Dashboard Features**

- **Live Stats**: Real-time counts of projects, experiences, and technologies
- **Search**: Find specific projects or experiences quickly
- **Mobile Support**: Fully responsive design for all devices

## 📁 Project Structure

```
my-portfolio-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/
│   │   │   └── dashboard/      # Admin dashboard pages
│   │   ├── api/
│   │   │   └── graphql/        # GraphQL API endpoint
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   ├── components/
│   │   ├── admin/
│   │   │   └── Dashboard/      # Dashboard components
│   │   ├── providers/          # Context providers
│   │   └── ui/                 # shadcn/ui components
│   ├── graphql/
│   │   ├── resolvers/          # GraphQL resolvers
│   │   └── schema/             # GraphQL schemas
│   ├── lib/                    # Utility functions
│   └── models/                 # MongoDB models
├── public/                     # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### **GraphQL Endpoint**

- **URL**: `/api/graphql`
- **Type**: POST

### **Available Queries**

```graphql
# Get all portfolios
query GetPortfolios {
  portfolios {
    id
    title
    description
    technologies
    featured
  }
}

# Get all experiences
query GetExperiences {
  experiences {
    id
    title
    company
    current
    startDate
    endDate
  }
}
```

### **Available Mutations**

```graphql
# Create portfolio
mutation CreatePortfolio($input: PortfolioInput!) {
  createPortfolio(input: $input) {
    id
    title
  }
}

# Create experience
mutation CreateExperience($input: ExperienceInput!) {
  createExperience(input: $input) {
    id
    title
  }
}
```

## 🎨 Customization

### **Styling**

- Modify `tailwind.config.ts` for theme customization
- Update `src/app/globals.css` for global styles
- Customize shadcn/ui components in `src/components/ui/`

### **Database Schema**

- Portfolio model: `src/models/Portfolio.ts`
- Experience model: `src/models/Experience.ts`

### **GraphQL Schema**

- Portfolio schema: `src/graphql/schema/portfolio.ts`
- Experience schema: `src/graphql/schema/experience.ts`

## 🚀 Deployment

### **Build for Production**

```bash
bun run build
bun start
```

### **Environment Variables for Production**

```env
MONGODB_URI=your_production_mongodb_uri
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Apollo GraphQL** for the excellent GraphQL implementation
- **Vercel** for the amazing Next.js framework
- **MongoDB** for the flexible database solution

## 📧 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ using Next.js, TypeScript, and GraphQL**
