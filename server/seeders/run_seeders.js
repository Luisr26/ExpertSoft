#!/usr/bin/env node
/*Main script to run all seeders*/

import { loadAllData, verifyDataLoading } from './load_all_data.js';

async function main() {
    try {
        console.log('🚀 Starting ExpertSoft Database Seeding Process...\n');
        
        // Load all data
        await loadAllData();
        
        // Verify data loading
        await verifyDataLoading();
        
        console.log('\n🎉 Database seeding completed successfully!');
        console.log('📊 All entities are now loaded and related in the database.');
        
    } catch (error) {
        console.error('\n❌ Fatal error during seeding process:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

// Run the main function
main().catch((error) => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
});