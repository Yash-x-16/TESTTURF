import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const SAMPLE_QUESTIONS = [
  // Biology
  {
    questionText: "Which organelle is known as the 'Powerhouse of the Cell'?",
    options: ["Ribosome", "Mitochondria", "Endoplasmic Reticulum", "Golgi apparatus"],
    correctAnswer: 1,
    subject: "Biology",
    topic: "Cell Biology",
    difficulty: "EASY",
    explanation: "Mitochondria produce ATP through cellular respiration, earning the title 'Powerhouse of the Cell'."
  },
  {
    questionText: "What is the normal diastolic blood pressure in a healthy adult human?",
    options: ["120 mm Hg", "80 mm Hg", "100 mm Hg", "60 mm Hg"],
    correctAnswer: 1,
    subject: "Biology",
    topic: "Human Physiology",
    difficulty: "EASY",
    explanation: "Standard blood pressure is 120/80 mm Hg, where 80 mm Hg is the diastolic pressure."
  },
  {
    questionText: "Which hormone is responsible for the 'Fight or Flight' response in humans?",
    options: ["Insulin", "Thyroxine", "Adrenaline (Epinephrine)", "Glucagon"],
    correctAnswer: 2,
    subject: "Biology",
    topic: "Endocrine System",
    difficulty: "MEDIUM",
    explanation: "Adrenaline is secreted by the adrenal medulla during stress or emergency conditions."
  },
  {
    questionText: "In DNA, adenine pairs with which nitrogenous base via two hydrogen bonds?",
    options: ["Guanine", "Cytosine", "Thymine", "Uracil"],
    correctAnswer: 2,
    subject: "Biology",
    topic: "Genetics",
    difficulty: "EASY",
    explanation: "According to Chargaff's rules and Watson-Crick model, Adenine (A) pairs with Thymine (T) in DNA with 2 hydrogen bonds."
  },
  {
    questionText: "Which of the following blood groups is considered a Universal Donor?",
    options: ["AB Positive", "O Negative", "A Positive", "B Negative"],
    correctAnswer: 1,
    subject: "Biology",
    topic: "Human Physiology",
    difficulty: "MEDIUM",
    explanation: "O Negative RBCs lack A, B, and Rh antigens, making it safe for transfusion to all ABO/Rh blood groups."
  },
  {
    questionText: "Which enzyme is responsible for unwinding the DNA double helix during replication?",
    options: ["DNA Polymerase", "DNA Helicase", "DNA Ligase", "RNA Primase"],
    correctAnswer: 1,
    subject: "Biology",
    topic: "Molecular Biology",
    difficulty: "MEDIUM",
    explanation: "DNA Helicase breaks the hydrogen bonds between bases to unwind the double helix structure."
  },

  // Physics
  {
    questionText: "What is the SI unit of electric potential difference?",
    options: ["Ampere", "Ohm", "Volt", "Coulomb"],
    correctAnswer: 2,
    subject: "Physics",
    topic: "Current Electricity",
    difficulty: "EASY",
    explanation: "Volt (V) is the SI unit of electric potential difference and electromotive force."
  },
  {
    questionText: "A body is projected vertically upwards. At the highest point, its acceleration is:",
    options: ["Zero", "Equal to 'g' directed downwards", "Equal to 'g' directed upwards", "Infinite"],
    correctAnswer: 1,
    subject: "Physics",
    topic: "Kinematics",
    difficulty: "MEDIUM",
    explanation: "Even at the peak where velocity is 0 m/s, the acceleration due to gravity 'g' continuously acts downward."
  },
  {
    questionText: "The phenomenon responsible for the twinkling of stars at night is:",
    options: ["Total Internal Reflection", "Atmospheric Refraction", "Dispersion of Light", "Diffraction"],
    correctAnswer: 1,
    subject: "Physics",
    topic: "Ray Optics",
    difficulty: "EASY",
    explanation: "Refractive index variations in earth's turbulent atmospheric layers cause atmospheric refraction of starlight."
  },
  {
    questionText: "Which law states that the total electric flux through a closed surface is equal to 1/ε₀ times the net charge enclosed?",
    options: ["Coulomb's Law", "Ampere's Law", "Gauss's Law", "Faraday's Law"],
    correctAnswer: 2,
    subject: "Physics",
    topic: "Electrostatics",
    difficulty: "EASY",
    explanation: "Gauss's Law in electrostatics relates electric flux to enclosed charge: ∮ E·dA = Q_enclosed / ε₀."
  },
  {
    questionText: "The dimensional formula for Planck's constant (h) is:",
    options: ["[M L² T⁻¹]", "[M L² T⁻²]", "[M L T⁻¹]", "[M L² T⁻³]"],
    correctAnswer: 0,
    subject: "Physics",
    topic: "Units and Dimensions",
    difficulty: "HARD",
    explanation: "From E = hν, [h] = [E]/[ν] = [M L² T⁻²] / [T⁻¹] = [M L² T⁻¹]."
  },

  // Chemistry
  {
    questionText: "What is the pH of pure water at 25°C?",
    options: ["0", "7", "14", "1"],
    correctAnswer: 1,
    subject: "Chemistry",
    topic: "Ionic Equilibrium",
    difficulty: "EASY",
    explanation: "At 25°C, [H⁺] = [OH⁻] = 10⁻⁷ M, hence pH = -log(10⁻⁷) = 7 (neutral)."
  },
  {
    questionText: "Which gas is evolved when zinc granules react with dilute sulphuric acid?",
    options: ["Oxygen", "Hydrogen", "Sulphur dioxide", "Nitrogen"],
    correctAnswer: 1,
    subject: "Chemistry",
    topic: "Inorganic Chemistry",
    difficulty: "EASY",
    explanation: "Zn + H₂SO₄ → ZnSO₄ + H₂↑. Hydrogen gas is liberated with effervescence."
  },
  {
    questionText: "The shape of a methane (CH₄) molecule according to VSEPR theory is:",
    options: ["Linear", "Trigonal Planar", "Tetrahedral", "Octahedral"],
    correctAnswer: 2,
    subject: "Chemistry",
    topic: "Chemical Bonding",
    difficulty: "EASY",
    explanation: "In CH₄, carbon has 4 bond pairs and 0 lone pairs (sp³ hybridization), resulting in a regular tetrahedral shape."
  },
  {
    questionText: "Which of the following is an example of an amphoteric oxide?",
    options: ["Na₂O", "SO₂", "Al₂O₃", "CaO"],
    correctAnswer: 2,
    subject: "Chemistry",
    topic: "Periodic Table & Properties",
    difficulty: "MEDIUM",
    explanation: "Aluminium oxide (Al₂O₃) reacts with both acids and bases to produce salt and water, making it amphoteric."
  },
  {
    questionText: "In the reaction: 2H₂ + O₂ → 2H₂O, oxygen undergoes:",
    options: ["Oxidation", "Reduction", "Hydrolysis", "Electrolysis"],
    correctAnswer: 1,
    subject: "Chemistry",
    topic: "Redox Reactions",
    difficulty: "MEDIUM",
    explanation: "The oxidation state of oxygen decreases from 0 in O₂ to -2 in H₂O, representing a reduction process."
  }
];

async function main() {
  console.log("🌱 Starting database seeding...");

  // Seed Questions
  console.log("Seeding NEET MCQs...");
  let count = 0;
  for (const q of SAMPLE_QUESTIONS) {
    const existing = await prisma.question.findFirst({
      where: { questionText: q.questionText }
    });

    if (!existing) {
      await prisma.question.create({
        data: {
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          subject: q.subject,
          topic: q.topic,
          difficulty: q.difficulty,
          explanation: q.explanation
        }
      });
      count++;
    }
  }
  console.log(`✅ Seeded ${count} new questions (Total in pool: ${SAMPLE_QUESTIONS.length})`);

  console.log("✅ Database seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
