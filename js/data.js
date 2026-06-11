/**
 * CureSync - Pharmacy Platform Sample Data
 * Technology Partner: SynXCloud
 *
 * This file contains the raw sample data seeded into LocalStorage on first execution.
 * Includes: 50 medicines (diverse categories), 50 customers, and 100 orders spanning 6 months.
 */

const SAMPLE_MEDICINES = [
    // --- PRESCRIPTION DRUGS (rxRequired: true) ---
    {
        id: "med-rx-01",
        name: "Amoxicillin 500mg",
        brand: "Amoxil",
        category: "Prescription",
        price: 18.50,
        stock: 45,
        unit: "30 Capsules",
        rxRequired: true,
        description: "Penicillin-type antibiotic used to treat a wide variety of bacterial infections.",
        usage: "Take 1 capsule every 8 hours with or without food for 10 days, or as directed by your doctor.",
        sideEffects: "Nausea, vomiting, diarrhea, skin rash, or yeast infection.",
        rating: 4.6,
        sales: 245
    },
    {
        id: "med-rx-02",
        name: "Metformin 500mg",
        brand: "Glucophage",
        category: "Prescription",
        price: 12.00,
        stock: 3, // Low stock alert demo
        unit: "60 Tablets",
        rxRequired: true,
        description: "Oral diabetes medicine that helps control blood sugar levels in people with type 2 diabetes.",
        usage: "Take 1 tablet twice daily with meals (breakfast and dinner), or as directed.",
        sideEffects: "Nausea, upset stomach, diarrhea, metallic taste in the mouth.",
        rating: 4.5,
        sales: 320
    },
    {
        id: "med-rx-03",
        name: "Atorvastatin 20mg",
        brand: "Lipitor",
        category: "Prescription",
        price: 24.90,
        stock: 80,
        unit: "30 Tablets",
        rxRequired: true,
        description: "Statin medication used to prevent cardiovascular disease and lower lipid levels (cholesterol).",
        usage: "Take 1 tablet daily in the evening, with or without food.",
        sideEffects: "Muscle pain, headache, nausea, mild joint stiffness.",
        rating: 4.7,
        sales: 410
    },
    {
        id: "med-rx-04",
        name: "Lisinopril 10mg",
        brand: "Zestril",
        category: "Prescription",
        price: 9.50,
        stock: 120,
        unit: "30 Tablets",
        rxRequired: true,
        description: "ACE inhibitor used to treat high blood pressure (hypertension) and heart failure.",
        usage: "Take 1 tablet daily at the same time each morning.",
        sideEffects: "Dry cough, dizziness, headache, fatigue.",
        rating: 4.4,
        sales: 185
    },
    {
        id: "med-rx-05",
        name: "Albuterol HFA Inhaler",
        brand: "ProAir",
        category: "Prescription",
        price: 35.00,
        stock: 35,
        unit: "1 Inhaler (200 puffs)",
        rxRequired: true,
        description: "Bronchodilator that relaxes muscles in the airways and increases airflow to the lungs.",
        usage: "Inhale 2 puffs every 4 to 6 hours as needed for wheezing or shortness of breath.",
        sideEffects: "Shakiness, rapid heartbeat, throat irritation, nervousness.",
        rating: 4.8,
        sales: 290
    },
    {
        id: "med-rx-06",
        name: "Gabapentin 300mg",
        brand: "Neurontin",
        category: "Prescription",
        price: 22.00,
        stock: 55,
        unit: "90 Capsules",
        rxRequired: true,
        description: "Anticonvulsant and analgesic medication used to treat shingles pain and seizures.",
        usage: "Take 1 capsule three times daily. Do not exceed 12 hours between doses.",
        sideEffects: "Drowsiness, dizziness, unsteadiness, peripheral swelling.",
        rating: 4.3,
        sales: 140
    },
    {
        id: "med-rx-07",
        name: "Levothyroxine 50mcg",
        brand: "Synthroid",
        category: "Prescription",
        price: 15.00,
        stock: 150,
        unit: "90 Tablets",
        rxRequired: true,
        description: "Thyroid hormone replacement used to treat hypothyroidism (underactive thyroid).",
        usage: "Take 1 tablet daily on an empty stomach, at least 30-60 minutes before breakfast.",
        sideEffects: "Usually well-tolerated unless dose is too high (palpitations, weight loss, insomnia).",
        rating: 4.8,
        sales: 380
    },
    {
        id: "med-rx-08",
        name: "Losartan Potassium 50mg",
        brand: "Cozaar",
        category: "Prescription",
        price: 14.20,
        stock: 2, // Low stock alert
        unit: "30 Tablets",
        rxRequired: true,
        description: "Angiotensin II receptor antagonist used to treat hypertension and protect kidneys in diabetic patients.",
        usage: "Take 1 tablet daily, with or without food.",
        sideEffects: "Dizziness, nasal congestion, back pain.",
        rating: 4.5,
        sales: 195
    },
    {
        id: "med-rx-09",
        name: "Omeprazole 40mg (Rx)",
        brand: "Prilosec",
        category: "Prescription",
        price: 18.00,
        stock: 65,
        unit: "30 Capsules",
        rxRequired: true,
        description: "Proton pump inhibitor (PPI) that decreases the amount of acid produced in the stomach.",
        usage: "Take 1 capsule daily in the morning, 30 minutes before breakfast.",
        sideEffects: "Headache, abdominal pain, mild diarrhea, flatulence.",
        rating: 4.6,
        sales: 275
    },
    {
        id: "med-rx-10",
        name: "Prednisone 10mg",
        brand: "Deltasone",
        category: "Prescription",
        price: 8.50,
        stock: 90,
        unit: "20 Tablets",
        rxRequired: true,
        description: "Corticosteroid medication used to suppress the immune system and decrease inflammation.",
        usage: "Take dose with meals in the morning. Complete the full prescribed course.",
        sideEffects: "Increased appetite, fluid retention, mood changes, sleep problems.",
        rating: 4.2,
        sales: 150
    },
    {
        id: "med-rx-11",
        name: "Montelukast 10mg",
        brand: "Singulair",
        category: "Prescription",
        price: 21.00,
        stock: 40,
        unit: "30 Tablets",
        rxRequired: true,
        description: "Leukotriene receptor antagonist used for the maintenance treatment of asthma and allergic rhinitis.",
        usage: "Take 1 tablet daily in the evening, with or without food.",
        sideEffects: "Headache, mild stomach discomfort, upper respiratory infection symptoms.",
        rating: 4.6,
        sales: 210
    },
    {
        id: "med-rx-12",
        name: "Sertraline HCl 50mg",
        brand: "Zoloft",
        category: "Prescription",
        price: 16.50,
        stock: 50,
        unit: "30 Tablets",
        rxRequired: true,
        description: "Selective serotonin reuptake inhibitor (SSRI) antidepressant used to treat depression, anxiety, and OCD.",
        usage: "Take 1 tablet daily, in the morning or evening, consistently.",
        sideEffects: "Nausea, dry mouth, insomnia, sweating, sexual dysfunction.",
        rating: 4.4,
        sales: 280
    },
    {
        id: "med-rx-13",
        name: "Metoprolol Succinate 25mg",
        brand: "Toprol XL",
        category: "Prescription",
        price: 13.80,
        stock: 75,
        unit: "30 Tablets",
        rxRequired: true,
        description: "Beta-blocker medication used to treat chest pain (angina), high blood pressure, and heart failure.",
        usage: "Take 1 tablet daily with or immediately after a meal.",
        sideEffects: "Fatigue, slow heart rate, dizziness, cold hands or feet.",
        rating: 4.5,
        sales: 165
    },
    {
        id: "med-rx-14",
        name: "Pantoprazole Sodium 40mg",
        brand: "Protonix",
        category: "Prescription",
        price: 17.50,
        stock: 4, // Low stock
        unit: "30 Tablets",
        rxRequired: true,
        description: "PPI used to treat erosive esophagitis and gastroesophageal reflux disease (GERD).",
        usage: "Take 1 tablet daily, 30-60 minutes before breakfast. Swallow whole.",
        sideEffects: "Headache, diarrhea, joint pain, nausea.",
        rating: 4.7,
        sales: 230
    },
    {
        id: "med-rx-15",
        name: "Amlodipine Besylate 5mg",
        brand: "Norvasc",
        category: "Prescription",
        price: 9.00,
        stock: 110,
        unit: "30 Tablets",
        rxRequired: true,
        description: "Calcium channel blocker used to treat high blood pressure and chest pain.",
        usage: "Take 1 tablet daily, with or without food, at the same time each day.",
        sideEffects: "Swelling in ankles/feet, headache, flushing, fatigue.",
        rating: 4.5,
        sales: 310
    },

    // --- OTC (OVER-THE-COUNTER) MEDICINES ---
    {
        id: "med-otc-01",
        name: "Paracetamol 500mg",
        brand: "Generic",
        category: "OTC",
        price: 3.50,
        stock: 300,
        unit: "20 Tablets",
        rxRequired: false,
        description: "Standard analgesic and antipyretic for relieving mild to moderate pain and reducing fever.",
        usage: "Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.",
        sideEffects: "Highly safe if taken in recommended doses. Liver damage can occur if exceeded.",
        rating: 4.8,
        sales: 980
    },
    {
        id: "med-otc-02",
        name: "Tylenol Extra Strength 500mg",
        brand: "Tylenol",
        category: "OTC",
        price: 7.99,
        stock: 140,
        unit: "50 Caplets",
        rxRequired: false,
        description: "Brand-name acetaminophen for rapid temporary relief of minor aches, pains, and fever.",
        usage: "Take 2 caplets every 6 hours while symptoms last. Max 6 caplets in 24 hours.",
        sideEffects: "Nausea, rash, or allergic reactions (rare). Avoid alcohol.",
        rating: 4.9,
        sales: 850
    },
    {
        id: "med-otc-03",
        name: "Advil Ibuprofen 200mg",
        brand: "Advil",
        category: "OTC",
        price: 8.50,
        stock: 150,
        unit: "50 Tablets",
        rxRequired: false,
        description: "NSAID pain reliever and fever reducer that targets inflammation at the source.",
        usage: "Take 1 tablet every 4-6 hours while symptoms persist. Max 6 tablets daily.",
        sideEffects: "Stomach upset, mild heartburn, nausea, dizziness.",
        rating: 4.8,
        sales: 740
    },
    {
        id: "med-otc-04",
        name: "Aleve Naproxen Sodium 220mg",
        brand: "Aleve",
        category: "OTC",
        price: 9.99,
        stock: 95,
        unit: "50 Caplets",
        rxRequired: false,
        description: "Long-lasting NSAID offering up to 12 hours of continuous pain relief with just one pill.",
        usage: "Take 1 tablet every 8-12 hours with a full glass of water. Max 2 tablets daily.",
        sideEffects: "Stomach irritation, constipation, dizziness, headache.",
        rating: 4.7,
        sales: 490
    },
    {
        id: "med-otc-05",
        name: "Claritin Loratadine 10mg",
        brand: "Claritin",
        category: "OTC",
        price: 18.90,
        stock: 60,
        unit: "30 Tablets",
        rxRequired: false,
        description: "Non-drowsy 24-hour relief from indoor and outdoor allergy symptoms (sneezing, runny nose).",
        usage: "Adults: 1 tablet daily with water.",
        sideEffects: "Headache, dry mouth, sleepiness (very rare).",
        rating: 4.6,
        sales: 390
    },
    {
        id: "med-otc-06",
        name: "Zyrtec Cetirizine 10mg",
        brand: "Zyrtec",
        category: "OTC",
        price: 19.50,
        stock: 65,
        unit: "30 Tablets",
        rxRequired: false,
        description: "Fast-acting allergy relief starting in hour 1. Treats watery eyes, sneezing, and itchy throat.",
        usage: "Take 1 tablet daily. Do not exceed 1 tablet in 24 hours.",
        sideEffects: "Drowsiness, dry mouth, fatigue.",
        rating: 4.7,
        sales: 430
    },
    {
        id: "med-otc-07",
        name: "Allegra Allergy 180mg",
        brand: "Allegra",
        category: "OTC",
        price: 22.00,
        stock: 50,
        unit: "30 Tablets",
        rxRequired: false,
        description: "Fexofenadine hydrochloride antihistamine offering non-drowsy relief from outdoor allergy triggers.",
        usage: "Take 1 tablet daily with water. Do not take with fruit juice.",
        sideEffects: "Headache, back pain, coughing.",
        rating: 4.6,
        sales: 290
    },
    {
        id: "med-otc-08",
        name: "Flonase Sensimist Allergy Spray",
        brand: "Flonase",
        category: "OTC",
        price: 16.80,
        stock: 45,
        unit: "1 Bottle (120 sprays)",
        rxRequired: false,
        description: "Nasal spray delivering 24-hour relief of nasal congestion, runny nose, and itchy eyes.",
        usage: "Gently blow nose. Spray 2 sprays into each nostril once daily.",
        sideEffects: "Nasal dryness, nosebleed, headache.",
        rating: 4.7,
        sales: 350
    },
    {
        id: "med-otc-09",
        name: "Benadryl Allergy Liqui-Gels",
        brand: "Benadryl",
        category: "OTC",
        price: 6.99,
        stock: 120,
        unit: "24 Liqui-Gels",
        rxRequired: false,
        description: "Antihistamine providing fast relief from hay fever, allergy, and cold symptoms.",
        usage: "Take 1-2 capsules every 4-6 hours. May cause significant drowsiness.",
        sideEffects: "Drowsiness, dry mouth, blurred vision, dizziness.",
        rating: 4.5,
        sales: 310
    },
    {
        id: "med-otc-10",
        name: "Mucinex DM 600mg",
        brand: "Mucinex",
        category: "OTC",
        price: 15.50,
        stock: 5, // Low stock demo
        unit: "20 Tablets",
        rxRequired: false,
        description: "Bi-layer tablets that thin and loosen mucus while suppressing cough for 12 hours.",
        usage: "Take 1 tablet every 12 hours. Do not crush, chew, or break tablet.",
        sideEffects: "Nausea, vomiting, headache, dizziness.",
        rating: 4.6,
        sales: 270
    },
    {
        id: "med-otc-11",
        name: "Pepto-Bismol Liquid Regular",
        brand: "Pepto-Bismol",
        category: "OTC",
        price: 5.80,
        stock: 85,
        unit: "230 ml",
        rxRequired: false,
        description: "Bismuth subsalicylate liquid for fast relief of upset stomach, nausea, heartburn, and diarrhea.",
        usage: "Shake well. Take 30 ml every 30-60 minutes as needed. Max 240 ml in 24 hours.",
        sideEffects: "Temporary darkening of the tongue and stool.",
        rating: 4.8,
        sales: 420
    },
    {
        id: "med-otc-12",
        name: "Imodium A-D Anti-Diarrheal",
        brand: "Imodium",
        category: "OTC",
        price: 7.20,
        stock: 75,
        unit: "24 Caplets",
        rxRequired: false,
        description: "Loperamide hydrochloride controls symptoms of diarrhea, often with the first dose.",
        usage: "Take 2 caplets after the first loose stool; 1 caplet after each subsequent loose stool.",
        sideEffects: "Dizziness, drowsiness, dry mouth, constipation.",
        rating: 4.6,
        sales: 210
    },
    {
        id: "med-otc-13",
        name: "Gaviscon Double Action Tablets",
        brand: "Gaviscon",
        category: "OTC",
        price: 8.90,
        stock: 60,
        unit: "24 Tablets",
        rxRequired: false,
        description: "Forms a protective barrier over stomach contents to prevent acid reflux and indigestion.",
        usage: "Chew 2-4 tablets thoroughly after meals and before bedtime.",
        sideEffects: "Constipation or mild bloating.",
        rating: 4.5,
        sales: 180
    },
    {
        id: "med-otc-14",
        name: "Robitussin Dry Cough Syrup",
        brand: "Robitussin",
        category: "OTC",
        price: 6.50,
        stock: 70,
        unit: "100 ml",
        rxRequired: false,
        description: "Soothes irritated throats and controls dry, hacking coughs for up to 8 hours.",
        usage: "Take 10 ml every 6-8 hours. Use the provided dosing cup.",
        sideEffects: "Mild drowsiness, nausea, dizziness.",
        rating: 4.4,
        sales: 140
    },
    {
        id: "med-otc-15",
        name: "Dulcolax Laxative 5mg",
        brand: "Dulcolax",
        category: "OTC",
        price: 5.90,
        stock: 110,
        unit: "25 Tablets",
        rxRequired: false,
        description: "Stimulant laxative providing dependable, overnight relief from constipation.",
        usage: "Take 1-2 tablets with water before bed. Do not take within 1 hour of antacids/milk.",
        sideEffects: "Abdominal cramps, diarrhea, nausea.",
        rating: 4.3,
        sales: 220
    },

    // --- WELLNESS & SUPPLEMENTS ---
    {
        id: "med-wel-01",
        name: "Multivitamin Men/Women",
        brand: "Nature Made",
        category: "Wellness",
        price: 14.50,
        stock: 120,
        unit: "90 Tablets",
        rxRequired: false,
        description: "Daily multivitamin tablet packed with 23 key nutrients to support overall immunity and bone health.",
        usage: "Take 1 tablet daily with a meal and a full glass of water.",
        sideEffects: "Mild stomach upset or metallic taste. Safe for daily use.",
        rating: 4.7,
        sales: 640
    },
    {
        id: "med-wel-02",
        name: "Vitamin C 1000mg + Zinc",
        brand: "Centrum",
        category: "Wellness",
        price: 9.90,
        stock: 140,
        unit: "60 Tablets",
        rxRequired: false,
        description: "High-potency antioxidant support to stimulate collagen production and boost immune function.",
        usage: "Take 1 tablet daily with breakfast.",
        sideEffects: "None under normal usage. Excess may cause mild stomach upset.",
        rating: 4.8,
        sales: 820
    },
    {
        id: "med-wel-03",
        name: "Vitamin D3 2000 IU",
        brand: "Nature Made",
        category: "Wellness",
        price: 8.50,
        stock: 180,
        unit: "100 Softgels",
        rxRequired: false,
        description: "Helps the body absorb calcium, support dental, bone, and muscle health, and boosts mood.",
        usage: "Take 1 softgel daily with a fat-containing meal for optimal absorption.",
        sideEffects: "Safe for regular use. Over-supplementation can lead to hypercalcemia.",
        rating: 4.9,
        sales: 730
    },
    {
        id: "med-wel-04",
        name: "Fish Oil Omega-3 1200mg",
        brand: "Nature Made",
        category: "Wellness",
        price: 16.90,
        stock: 90,
        unit: "120 Softgels",
        rxRequired: false,
        description: "Purified to eliminate mercury. Supports heart, brain, and joint health.",
        usage: "Take 2 softgels daily with a meal.",
        sideEffects: "Fishy aftertaste (minimized in enteric coated versions), mild stomach upset.",
        rating: 4.6,
        sales: 540
    },
    {
        id: "med-wel-05",
        name: "Biotin 5000mcg Super Strength",
        brand: "Natrol",
        category: "Wellness",
        price: 11.20,
        stock: 85,
        unit: "100 Tablets",
        rxRequired: false,
        description: "B-complex vitamin that helps support healthy hair growth, radiant skin, and strong nails.",
        usage: "Take 1 tablet daily with food.",
        sideEffects: "Rarely, skin breakouts. Keep well hydrated.",
        rating: 4.5,
        sales: 380
    },
    {
        id: "med-wel-06",
        name: "Probiotics Daily Support",
        brand: "SynXBio",
        category: "Wellness",
        price: 24.00,
        stock: 1, // Low stock demo
        unit: "30 Capsules",
        rxRequired: false,
        description: "Contains 10 documented bacterial strains to replenish healthy gut microflora and ease bloating.",
        usage: "Take 1 capsule daily, preferably in the morning before breakfast.",
        sideEffects: "Mild gas or bloating during the first few days of use.",
        rating: 4.8,
        sales: 290
    },
    {
        id: "med-wel-07",
        name: "Ashwagandha KSM-66 600mg",
        brand: "Organic India",
        category: "Wellness",
        price: 18.00,
        stock: 75,
        unit: "60 Veg Capsules",
        rxRequired: false,
        description: "Clinically proven adaptogen that reduces stress, anxiety, cortisol levels, and boosts energy.",
        usage: "Take 1 capsule twice daily with warm water or milk.",
        sideEffects: "Mild drowsiness, stomach upset.",
        rating: 4.7,
        sales: 360
    },
    {
        id: "med-wel-08",
        name: "Melatonin 5mg Sleep Gummies",
        brand: "Natrol",
        category: "Wellness",
        price: 12.50,
        stock: 130,
        unit: "90 Gummies",
        rxRequired: false,
        description: "100% drug-free sleep aid. Strawberry flavored gummies help you fall asleep faster and wake up refreshed.",
        usage: "Chew 2 gummies 20-30 minutes before bedtime.",
        sideEffects: "Next-day grogginess if taken too late, vivid dreams.",
        rating: 4.7,
        sales: 580
    },
    {
        id: "med-wel-09",
        name: "Magnesium Glycinate 400mg",
        brand: "Solaray",
        category: "Wellness",
        price: 15.99,
        stock: 80,
        unit: "120 VegCaps",
        rxRequired: false,
        description: "Highly bioavailable form of magnesium supporting muscle relaxation, nerve health, and deep sleep.",
        usage: "Take 4 capsules daily with a meal or glass of water (can split throughout the day).",
        sideEffects: "Mild laxative effect in sensitive individuals (less common with glycinate).",
        rating: 4.8,
        sales: 470
    },
    {
        id: "med-wel-10",
        name: "Coenzyme Q10 (CoQ10) 100mg",
        brand: "Nature Made",
        category: "Wellness",
        price: 26.50,
        stock: 45,
        unit: "72 Softgels",
        rxRequired: false,
        description: "Essential antioxidant supporting cellular energy production and overall cardiovascular function.",
        usage: "Take 1 softgel daily with food.",
        sideEffects: "Mild stomach discomfort (rare).",
        rating: 4.6,
        sales: 190
    },

    // --- PERSONAL CARE & HYGIENE ---
    {
        id: "med-pc-01",
        name: "CeraVe Moisturizing Cream",
        brand: "CeraVe",
        category: "Personal Care",
        price: 16.20,
        stock: 90,
        unit: "453 g (16 oz)",
        rxRequired: false,
        description: "Rich, non-greasy cream containing 3 essential ceramides and hyaluronic acid to restore skin barrier.",
        usage: "Apply liberally to face and body as often as needed, or as directed by a dermatologist.",
        sideEffects: "Extremely well tolerated. Hypoallergenic and non-comedogenic.",
        rating: 4.9,
        sales: 720
    },
    {
        id: "med-pc-02",
        name: "Hydro Boost Water Gel",
        brand: "Neutrogena",
        category: "Personal Care",
        price: 18.50,
        stock: 70,
        unit: "50 g",
        rxRequired: false,
        description: "Lightweight, oil-free moisturizer that instantly absorbs and delivers long-lasting hydration.",
        usage: "Apply evenly to face and neck daily after cleansing.",
        sideEffects: "Rare mild burning or stinging in extremely sensitive skin.",
        rating: 4.7,
        sales: 580
    },
    {
        id: "med-pc-03",
        name: "Gentle Skin Cleanser",
        brand: "Cetaphil",
        category: "Personal Care",
        price: 12.90,
        stock: 110,
        unit: "591 ml",
        rxRequired: false,
        description: "Clinically proven to hydrate while cleansing. Preserves skin's natural moisture barrier.",
        usage: "Apply to skin and massage gently. Rinse with water, or wipe off with a soft cloth.",
        sideEffects: "None. Formulated for dry, sensitive skin.",
        rating: 4.8,
        sales: 610
    },
    {
        id: "med-pc-04",
        name: "Listerine Cool Mint Mouthwash",
        brand: "Listerine",
        category: "Personal Care",
        price: 6.80,
        stock: 150,
        unit: "1 Liter",
        rxRequired: false,
        description: "Kills 99.9% of bad breath germs, plaque, and gingivitis bacteria for a cleaner mouth.",
        usage: "Rinse full strength with 20 ml for 30 seconds twice daily. Do not swallow.",
        sideEffects: "Temporary burning sensation in mouth due to alcohol.",
        rating: 4.7,
        sales: 510
    },
    {
        id: "med-pc-05",
        name: "Daily Moisturizing Lotion",
        brand: "Aveeno",
        category: "Personal Care",
        price: 10.50,
        stock: 95,
        unit: "354 ml",
        rxRequired: false,
        description: "Nourishes dry skin with prebiotic colloidal oat formula. Clinically shown to improve skin health in 1 day.",
        usage: "Apply to hands and body daily or as needed to relieve dry skin.",
        sideEffects: "Safe for sensitive skin.",
        rating: 4.8,
        sales: 440
    },
    {
        id: "med-pc-06",
        name: "Colgate Total Clean Mint",
        brand: "Colgate",
        category: "Personal Care",
        price: 4.20,
        stock: 220,
        unit: "120 g",
        rxRequired: false,
        description: "Fluoride toothpaste that prevents cavities, plaque, tartar, and gingivitis. Provides 12-hour protection.",
        usage: "Brush teeth thoroughly, preferably after each meal or at least twice a day.",
        sideEffects: "None under normal usage.",
        rating: 4.7,
        sales: 780
    },
    {
        id: "med-pc-07",
        name: "Nivea Cream",
        brand: "Nivea",
        category: "Personal Care",
        price: 5.50,
        stock: 130,
        unit: "150 ml",
        rxRequired: false,
        description: "The original rich moisturizer for all skin types. Provides intensive protective care.",
        usage: "Apply daily over face, hands, and body as needed.",
        sideEffects: "Heavy texture; might be comedogenic for acne-prone facial skin.",
        rating: 4.6,
        sales: 420
    },
    {
        id: "med-pc-08",
        name: "Classic Clean Shampoo",
        brand: "Head & Shoulders",
        category: "Personal Care",
        price: 7.90,
        stock: 85,
        unit: "400 ml",
        rxRequired: false,
        description: "72-hour protection against flakes, itch, and dryness. Formulated with Zinc Pyrithione.",
        usage: "Wet hair, massage onto scalp, rinse, repeat if desired. Use at least twice a week.",
        sideEffects: "Mild scalp irritation in rare cases.",
        rating: 4.5,
        sales: 390
    },
    {
        id: "med-pc-09",
        name: "Anthelios Melt-in Sunscreen SPF 60",
        brand: "La Roche-Posay",
        category: "Personal Care",
        price: 24.99,
        stock: 4, // Low stock alert demo
        unit: "150 ml",
        rxRequired: false,
        description: "Broad-spectrum UVA/UVB protection with antioxidants. Fast-absorbing, velvety finish.",
        usage: "Apply generously 15 minutes before sun exposure. Reapply every 2 hours.",
        sideEffects: "Avoid contact with eyes. Hypoallergenic.",
        rating: 4.9,
        sales: 290
    },
    {
        id: "med-pc-10",
        name: "Sensibio H2O Micellar Water",
        brand: "Bioderma",
        category: "Personal Care",
        price: 14.90,
        stock: 80,
        unit: "500 ml",
        rxRequired: false,
        description: "Cleansing and make-up removing micellar water that respects the sensitivity of skin.",
        usage: "Soak a cotton pad and gently cleanse face/eyes. Do not rinse.",
        sideEffects: "Soothes skin, very high tolerance.",
        rating: 4.8,
        sales: 340
    }
];

// --- 50 SAMPLE CUSTOMERS ---
const FIRST_NAMES = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", 
                     "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
                     "Amit", "Priya", "Rahul", "Ananya", "Rajesh", "Sunita", "Vikram", "Deepa", "Sanjay", "Neha",
                     "Daniel", "Matthew", "Sandra", "Ashley", "Emily", "Amanda", "Jessica", "Melissa", "Deborah", "Stephanie",
                     "Arjun", "Aditi", "Dev", "Kiran", "Vijay", "Preeti", "Rohan", "Shalini", "Ravi", "Pooja"];

const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
                    "Sharma", "Patel", "Verma", "Gupta", "Mehra", "Joshi", "Kumar", "Singh", "Das", "Sen",
                    "Wilson", "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
                    "Rao", "Nair", "Iyer", "Choudhury", "Bose", "Reddy", "Banerjee", "Mukherjee", "Chatterjee", "Mishra",
                    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen"];

const STREETS = ["123 Healthcare Ave", "456 Wellness Blvd", "789 Cure Lane", "12 Pharmacy Rd", "55 Healing Circle",
                 "88 Remedy St", "210 Science Park", "34 Clinic Crossing", "101 Doctor Row", "44 Care Court"];

const CITIES = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];

function generateCustomers() {
    const customers = [];
    for (let i = 0; i < 50; i++) {
        const fName = FIRST_NAMES[i % FIRST_NAMES.length];
        const lName = LAST_NAMES[i % LAST_NAMES.length];
        const name = `${fName} ${lName}`;
        const email = `${fName.toLowerCase()}.${lName.toLowerCase()}@example.com`;
        const phone = `+1 (555) ${100 + i}-${4000 + i}`;
        
        // Random loyalty points between 50 and 2400
        const loyaltyPoints = Math.floor(Math.random() * 2350) + 50;
        
        // Dynamic address
        const street = STREETS[i % STREETS.length];
        const city = CITIES[Math.floor((i * 7) % CITIES.length)];
        const zip = `${10000 + (i * 187) % 90000}`;
        const address = `${street}, ${city}, NY ${zip}`;

        customers.push({
            id: `cust-${100 + i}`,
            name: name,
            email: email,
            phone: phone,
            loyaltyPoints: loyaltyPoints,
            address: address,
            avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${fName}${lName}`
        });
    }
    return customers;
}

const SAMPLE_CUSTOMERS = generateCustomers();

// --- 100 SAMPLE ORDERS (Spread over past 6 months) ---
function generateOrders(customers, medicines) {
    const orders = [];
    const statuses = ["Delivered", "Delivered", "Delivered", "Delivered", "Delivered", "Out for Delivery", "Packed", "Verified", "Ordered"];
    const paymentMethods = ["Cash on Delivery", "Credit Card", "UPI / Digital Wallet"];
    const rxPrescriptions = [
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600"
    ];

    // Seed dates over the last 180 days
    const now = new Date();

    for (let i = 0; i < 100; i++) {
        // Pick a random customer
        const customer = customers[i % customers.length];
        
        // Random number of items (1 to 4)
        const itemCount = Math.floor(Math.random() * 4) + 1;
        const orderItems = [];
        let subtotal = 0;
        let hasRx = false;

        // Select items randomly, ensuring no duplicates in the same order
        const selectedIndices = new Set();
        while (orderItems.length < itemCount) {
            const medIndex = Math.floor(Math.random() * medicines.length);
            if (!selectedIndices.has(medIndex)) {
                selectedIndices.add(medIndex);
                const med = medicines[medIndex];
                const qty = Math.floor(Math.random() * 2) + 1;
                
                if (med.rxRequired) {
                    hasRx = true;
                }

                orderItems.push({
                    productId: med.id,
                    name: med.name,
                    price: med.price,
                    quantity: qty,
                    category: med.category
                });
                
                subtotal += med.price * qty;
            }
        }

        // Calculations
        const deliveryFee = subtotal > 35 ? 0 : 4.99;
        const discount = i % 5 === 0 ? Math.round(subtotal * 0.1 * 100) / 100 : 0; // 10% discount for every 5th order
        const total = Math.round((subtotal + deliveryFee - discount) * 100) / 100;

        // Status distribution: older orders are Delivered, recent ones have variation
        let status = "Delivered";
        if (i > 85) {
            status = statuses[i % statuses.length];
        }

        // Order date spacing (stretching back 6 months)
        const daysAgo = 180 - Math.floor((i / 100) * 180);
        const orderDate = new Date();
        orderDate.setDate(now.getDate() - daysAgo);
        orderDate.setHours(9 + (i % 12), (i * 7) % 60, 0, 0);

        orders.push({
            id: `ORD-${1000 + i}`,
            customerId: customer.id,
            customerName: customer.name,
            customerPhone: customer.phone,
            customerEmail: customer.email,
            customerAddress: customer.address,
            date: orderDate.toISOString(),
            items: orderItems,
            subtotal: Math.round(subtotal * 100) / 100,
            deliveryFee: deliveryFee,
            discount: discount,
            total: total,
            status: status,
            paymentMethod: paymentMethods[i % paymentMethods.length],
            prescriptionUrl: hasRx ? rxPrescriptions[i % rxPrescriptions.length] : null,
            loyaltyPointsEarned: Math.floor(total * 0.1) // 10% of total as points
        });
    }

    return orders;
}

// Global export wrappers for ease of file imports
window.CureSyncData = {
    medicines: SAMPLE_MEDICINES,
    customers: SAMPLE_CUSTOMERS,
    getGeneratedOrders: function() {
        return generateOrders(SAMPLE_CUSTOMERS, SAMPLE_MEDICINES);
    }
};
