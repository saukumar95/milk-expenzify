# Milk Expenzify

A modern web application to track and manage daily milk expenses efficiently. Built with Next.js 13+, TypeScript, Tailwind CSS, and Supabase.

## Features

- 📊 **Dashboard Overview**
  - View current milk price
  - Track monthly and weekly expenses
  - Quick summary statistics
  - Add daily milk purchase entries

- 📝 **Entry Management**
  - Add, edit, and delete milk purchase entries
  - Track quantity, price, and total amount
  - Date-based entry organization

- 📅 **History Tracking**
  - View complete purchase history
  - Filter entries by date range
  - Sort and organize historical data

- 📈 **Reports**
  - Generate detailed expense reports
  - View total quantity and amount statistics
  - Calculate average prices
  - Export or print reports

- ⚙️ **Settings Management**
  - Configure milk price
  - Manage vendor information
  - Update vendor contact details
  - Customize vendor address

- 🔐 **Authentication**
  - Secure user authentication
  - Protected routes
  - Personal data privacy

## Tech Stack

- **Frontend Framework**: Next.js 13+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **State Management**: React Context
- **Forms**: React Hook Form
- **Date Handling**: date-fns

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/milk-expenzify.git
   cd milk-expenzify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js 13+ app router pages and layouts
- `/components` - Reusable React components
- `/lib` - Utility functions and shared logic
- `/hooks` - Custom React hooks
- `/styles` - Global styles and Tailwind configuration
- `/public` - Static assets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.