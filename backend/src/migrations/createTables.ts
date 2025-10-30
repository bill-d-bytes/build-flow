import { connectDatabase } from '../config/database';
import { createUsersTable } from '../models/User';
import { createProductsTable } from '../models/Product';
import { createOrdersTable } from '../models/Order';

async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...');
    
    // Connect to database
    await connectDatabase();
    
    // Create tables in order (respecting foreign keys)
    console.log('📋 Creating users table...');
    await createUsersTable();
    
    console.log('📋 Creating products table...');
    await createProductsTable();
    
    console.log('📋 Creating orders table...');
    await createOrdersTable();
    
    console.log('✅ All tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();

