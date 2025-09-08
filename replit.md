# Spaizd - Premium Cannabis Streetwear E-commerce Platform

## Overview
Cannabis-themed streetwear e-commerce platform featuring premium apparel, limited drops, VIP memberships, and comprehensive admin functionality. Built with Next.js, Supabase, and modern e-commerce best practices.

## Recent Changes (September 8, 2025)
- **✅ Complete Supabase Integration**: Replaced all mock data with real database connections
- **✅ Section-Specific Backgrounds**: Cannabis-themed images for different app sections with text overlay for readability
- **✅ Database Schema**: Comprehensive SQL setup script created for full platform functionality
- **✅ Real Product Catalog**: Products, categories, variants, and pricing connected to database
- **✅ Drop System**: Limited releases with VIP early access functionality
- **✅ Admin Infrastructure**: Feature flags, compliance tracking, audit logs

## Project Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS with custom cannabis-themed design system
- **UI Components**: Radix UI with custom styling
- **State Management**: Zustand for cart and user state
- **Background System**: Dynamic cannabis-themed backgrounds per section

### Backend & Database (Supabase)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with automatic profile creation
- **Real-time**: Supabase subscriptions for live updates
- **Storage**: Image management and file uploads
- **API**: Custom API routes with server-side database integration

### Key Features
1. **Product Catalog**: Real products with variants, pricing, and inventory
2. **Drop System**: Limited releases with countdown timers and VIP access
3. **VIP Memberships**: Tiered system (Gold/Platinum/Diamond) with benefits
4. **Shopping Cart**: Persistent cart with real product data
5. **Admin Dashboard**: Product management, order tracking, compliance tools
6. **Cannabis Theme**: Section-specific background images and cannabis culture design

## Database Tables
- `profiles` - User accounts and roles
- `categories` - Product categories
- `products` - Product catalog with images and pricing
- `product_variants` - Size/color variations
- `drops` - Limited release campaigns
- `drop_products` - Products in specific drops with special pricing
- `orders` & `order_items` - E-commerce transactions
- `vip_tiers` & `vip_memberships` - Membership system
- `feature_flags` - Admin toggles for functionality
- `compliance_alerts` - Legal compliance tracking
- `audit_logs` - Admin action tracking

## Environment Configuration
- **NEXT_PUBLIC_SUPABASE_URL**: Supabase project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Public Supabase key
- **SUPABASE_SERVICE_ROLE_KEY**: Server-side Supabase key

## Development Setup
1. Environment configured for Replit with proper host settings
2. Database schema ready in `supabase-complete-setup.sql`
3. All API endpoints connected to real data
4. Background images configured for each section
5. Workflow configured for frontend development server

## Cannabis-Themed Background System
- **Homepage**: Macro trichome photography
- **Shop**: Cannabis cultivation workspace
- **Admin**: Professional grow room facility
- **Drops**: Premium cannabis plants with LED lighting
- **VIP**: Professional cultivation facility
- **Legal/Compliance**: Clean indoor grow tent
- **Account/Orders**: Macro purple trichomes
- **Contact/Support**: Cannabis cola close-ups

## Next Development Priorities
1. **Shopping Cart & Checkout**: Stripe payment integration
2. **User Authentication**: Login/signup flows and account management
3. **VIP System**: Payment processing and member benefits
4. **Admin Dashboard**: Full product and order management
5. **Drop Queue System**: High-demand release management

## Technical Notes
- All database connections use async/await properly
- Row Level Security implemented for data protection
- Background images use overlay system for text readability
- API routes handle real Supabase data with error handling
- Development server configured for Replit environment