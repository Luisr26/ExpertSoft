/*Main seeder that loads all normalized data into the database*/
import { loadPlatformsToDatabase } from './load_plataformas.js';
import { loadNormalizedClientsToDatabase } from './load_clientes_normalizado.js';
import { loadNormalizedInvoicesToDatabase } from './load_facturas_normalizado.js';
import { loadNormalizedTransactionsToDatabase } from './load_transacciones_normalizado.js';

export async function loadAllData() {
    console.log('🚀 Starting to load all normalized data...\n');

    try {
        // 1. Load platforms first (no dependencies)
        console.log('📱 Loading platforms...');
        await loadPlatformsToDatabase();
        console.log('✅ Platforms loaded successfully\n');

        // 2. Load clients (no dependencies)
        console.log('👥 Loading clients...');
        await loadNormalizedClientsToDatabase();
        console.log('✅ Clients loaded successfully\n');

        // 3. Load invoices (no dependencies)
        console.log('🧾 Loading invoices...');
        await loadNormalizedInvoicesToDatabase();
        console.log('✅ Invoices loaded successfully\n');

        // 4. Load transactions (depends on clients, platforms and invoices)
        console.log('💳 Loading transactions...');
        await loadNormalizedTransactionsToDatabase();
        console.log('✅ Transactions loaded successfully\n');

        console.log('🎉 ALL DATA HAS BEEN LOADED SUCCESSFULLY!');
        console.log('📊 The database is ready to use with all related entities.');

    } catch (error) {
        console.error('❌ Error during data loading:', error.message);
        throw error;
    }
}

// Function to verify that all data was loaded correctly
export async function verifyDataLoading() {
    try {
        const { pool } = await import('../conexion_db.js');
        
        console.log('\n🔍 Verifying data loading...\n');

        // Verify platforms
        const [platforms] = await pool.query('SELECT COUNT(*) as total FROM plataformas');
        console.log(`📱 Platforms in DB: ${platforms[0].total}`);

        // Verify clients
        const [clients] = await pool.query('SELECT COUNT(*) as total FROM clientes');
        console.log(`👥 Clients in DB: ${clients[0].total}`);

        // Verify invoices
        const [invoices] = await pool.query('SELECT COUNT(*) as total FROM facturas');
        console.log(`🧾 Invoices in DB: ${invoices[0].total}`);

        // Verify transactions
        const [transactions] = await pool.query('SELECT COUNT(*) as total FROM transacciones');
        console.log(`💳 Transactions in DB: ${transactions[0].total}`);

        // Verify relationships
        const [relationships] = await pool.query(`
            SELECT 
                COUNT(DISTINCT t.id_cliente) as clients_with_transactions,
                COUNT(DISTINCT t.id_plataforma) as platforms_used,
                COUNT(DISTINCT t.id_factura) as invoices_with_transactions
            FROM transacciones t
        `);
        console.log(`🔗 Relationships verified:`);
        console.log(`   - Clients with transactions: ${relationships[0].clients_with_transactions}`);
        console.log(`   - Platforms used: ${relationships[0].platforms_used}`);
        console.log(`   - Invoices with transactions: ${relationships[0].invoices_with_transactions}`);

        console.log('\n✅ Verification completed successfully');

    } catch (error) {
        console.error('❌ Error during verification:', error.message);
        throw error;
    }
}

// If this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    try {
        await loadAllData();
        await verifyDataLoading();
        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}
