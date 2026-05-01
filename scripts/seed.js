#!/usr/bin/env node

/**
 * VetCare Sample Data Seed Script
 * Usage: node scripts/seed.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase env vars. Check .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  console.log('🌱 Seeding VetCare sample data...\n');

  try {
    // ==========================================
    // 1. Create Test Users (with Auth)
    // ==========================================
    console.log('📝 Creating test users...');

    const testUsers = [
      {
        email: 'customer@example.com',
        password: 'password123',
        name: 'Budi Santoso',
        role: 'customer',
      },
      {
        email: 'doctor@example.com',
        password: 'password123',
        name: 'Dr. Hendra',
        role: 'doctor',
      },
      {
        email: 'staff@example.com',
        password: 'password123',
        name: 'Siti Nurhaliza',
        role: 'staff',
      },
      {
        email: 'admin@example.com',
        password: 'password123',
        name: 'Administrator',
        role: 'admin',
      },
    ];

    for (const user of testUsers) {
      try {
        const { data, error } = await supabase.auth.signUpWithPassword({
          email: user.email,
          password: user.password,
          options: {
            data: {
              full_name: user.name,
              role: user.role,
            },
          },
        });

        if (error && error.message.includes('already exists')) {
          console.log(`  ⏭️  ${user.email} already exists`);
        } else if (error) {
          console.error(`  ❌ Error creating ${user.email}:`, error.message);
        } else {
          console.log(`  ✅ Created ${user.email} (${user.role})`);
        }
      } catch (err) {
        console.error(`  ❌ Error: ${err.message}`);
      }
    }

    // ==========================================
    // 2. Get created user IDs
    // ==========================================
    console.log('\n📋 Fetching user IDs...');

    const { data: usersData } = await supabase.auth.admin.listUsers();
    const userMap = {};
    if (usersData?.users) {
      usersData.users.forEach(user => {
        userMap[user.email] = user.id;
      });
    }

    console.log(`  ✅ Found ${Object.keys(userMap).length} users`);

    // ==========================================
    // 3. Create Sample Doctors
    // ==========================================
    console.log('\n👨‍⚕️ Creating doctors...');

    const doctorIds = [];
    const doctors = [
      { name: 'Dr. Hendra', specialization: 'General Practice' },
      { name: 'Dr. Rina', specialization: 'Small Animals' },
    ];

    for (const doctor of doctors) {
      const { data, error } = await supabase.from('doctors').insert({
        name: doctor.name,
        specialization: doctor.specialization,
        license_number: `LIC-${Math.random().toString(36).substr(2, 9)}`,
      });

      if (error) {
        console.log(`  ⏭️  ${doctor.name} might already exist`);
      } else {
        doctorIds.push(data[0]?.id);
        console.log(`  ✅ Created ${doctor.name}`);
      }
    }

    // ==========================================
    // 4. Create Services
    // ==========================================
    console.log('\n💼 Creating services...');

    const serviceIds = [];
    const services = [
      {
        name: 'Pemeriksaan Rutin',
        description: 'Pemeriksaan kesehatan umum',
        duration_minutes: 30,
        price: 150000,
        category: 'checkup',
      },
      {
        name: 'Vaksinasi',
        description: 'Vaksin lengkap untuk hewan peliharaan',
        duration_minutes: 30,
        price: 200000,
        category: 'vaccination',
      },
      {
        name: 'Perawatan Gigi',
        description: 'Pembersihan dan scaling gigi',
        duration_minutes: 45,
        price: 350000,
        category: 'dental',
      },
      {
        name: 'Grooming',
        description: 'Perawatan bulu dan kuku',
        duration_minutes: 60,
        price: 250000,
        category: 'grooming',
      },
    ];

    for (const service of services) {
      const { data, error } = await supabase.from('services').insert(service);

      if (error) {
        console.log(`  ⏭️  ${service.name} might already exist`);
      } else {
        serviceIds.push(data[0]?.id);
        console.log(`  ✅ Created ${service.name}`);
      }
    }

    // ==========================================
    // 5. Create Sample Pets
    // ==========================================
    console.log('\n🐾 Creating sample pets...');

    const customerId = userMap['customer@example.com'];
    if (!customerId) {
      console.log('  ⚠️  Customer not found, skipping pets');
    } else {
      const pets = [
        {
          owner_id: customerId,
          name: 'Fluffy',
          species: 'cat',
          breed: 'Persia',
          gender: 'female',
          birth_date: '2022-01-15',
          weight_kg: 4.5,
          chip_number: `CHIP-${Math.random().toString(36).substr(2, 9)}`,
        },
        {
          owner_id: customerId,
          name: 'Max',
          species: 'dog',
          breed: 'Golden Retriever',
          gender: 'male',
          birth_date: '2021-06-20',
          weight_kg: 28.5,
          chip_number: `CHIP-${Math.random().toString(36).substr(2, 9)}`,
        },
      ];

      for (const pet of pets) {
        const { data, error } = await supabase.from('pets').insert(pet);

        if (error) {
          console.log(`  ⏭️  ${pet.name} might already exist`);
        } else {
          console.log(`  ✅ Created pet: ${pet.name}`);
        }
      }
    }

    // ==========================================
    // 6. Create Sample Appointments
    // ==========================================
    console.log('\n📅 Creating sample appointments...');

    if (!customerId || !doctorIds[0] || !serviceIds[0]) {
      console.log('  ⚠️  Missing required data (customer/doctor/service)');
    } else {
      const petResult = await supabase
        .from('pets')
        .select('id')
        .eq('owner_id', customerId)
        .limit(1);

      if (petResult.data?.[0]) {
        const petId = petResult.data[0].id;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const appointments = [
          {
            pet_id: petId,
            doctor_id: doctorIds[0],
            service_id: serviceIds[0],
            appointment_date: tomorrow.toISOString().split('T')[0],
            time_slot: '09:00',
            status: 'scheduled',
            notes: 'Rutin checkup tahunan',
          },
          {
            pet_id: petId,
            doctor_id: doctorIds[1],
            service_id: serviceIds[1],
            appointment_date: tomorrow.toISOString().split('T')[0],
            time_slot: '10:00',
            status: 'scheduled',
            notes: 'Update vaksin tahunan',
          },
        ];

        for (const apt of appointments) {
          const { error } = await supabase
            .from('appointments')
            .insert(apt);

          if (error) {
            console.log(`  ⏭️  Appointment might already exist`);
          } else {
            console.log(`  ✅ Created appointment on ${apt.appointment_date}`);
          }
        }
      }
    }

    // ==========================================
    // 7. Create Sample Medical Records
    // ==========================================
    console.log('\n📋 Creating sample medical records...');

    const petResult = await supabase
      .from('pets')
      .select('id')
      .eq('owner_id', customerId)
      .limit(1);

    if (petResult.data?.[0]) {
      const petId = petResult.data[0].id;

      const medicalRecords = [
        {
          pet_id: petId,
          doctor_id: doctorIds[0],
          date: new Date().toISOString().split('T')[0],
          chief_complaint: 'Pemeriksaan rutin',
          diagnosis: 'Kondisi umum baik',
          treatment: 'Vaksinasi booster',
        },
      ];

      for (const record of medicalRecords) {
        const { error } = await supabase
          .from('medical_records')
          .insert(record);

        if (error) {
          console.log(`  ⏭️  Medical record might already exist`);
        } else {
          console.log(`  ✅ Created medical record`);
        }
      }
    }

    // ==========================================
    // 8. Create Feature Flags (for CMS)
    // ==========================================
    console.log('\n🚩 Creating feature flags...');

    const features = [
      { key: 'enable_booking', enabled: true, description: 'Enable booking system' },
      { key: 'enable_emr', enabled: true, description: 'Enable EMR system' },
      {
        key: 'enable_recovery_journey',
        enabled: true,
        description: 'Enable real-time recovery tracking',
      },
      { key: 'enable_telemedicine', enabled: false, description: 'Enable video consultation' },
    ];

    for (const flag of features) {
      const { error } = await supabase.from('feature_flags').insert(flag);

      if (error) {
        console.log(`  ⏭️  ${flag.key} might already exist`);
      } else {
        console.log(`  ✅ Created feature flag: ${flag.key}`);
      }
    }

    console.log('\n✅ Seeding completed successfully!\n');
    console.log('📝 Test Credentials:');
    console.log('   Customer: customer@example.com / password123');
    console.log('   Doctor:   doctor@example.com / password123');
    console.log('   Admin:    admin@example.com / password123\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedData();
