# ARES — Database Schema & Architecture

## Database
PostgreSQL accessed exclusively through Prisma ORM.

## Relationship
```text
User
 ├── Dataset
 └── Experiment
       ├── AttackResult
       ├── DefenseResult
       ├── FeatureContribution
       ├── Recommendation
       └── Report

Dataset
 └── DatasetSample
```

## Prisma Schema

```prisma
enum Role {
  ADMIN
  ANALYST
  USER
}

enum SampleLabel {
  MALWARE
  BENIGN
}

enum ExperimentStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
}

enum AttackType {
  PADDING
  GAMMA_INSPIRED
}

enum SamplePrediction {
  MALWARE
  BENIGN
}

enum DefenseType {
  BASELINE
  ADVERSARIAL_TRAINING_SIMULATION
  MONOTONIC_CONSTRAINT_SIMULATION
}

enum ContributionDirection {
  POSITIVE
  NEGATIVE
  NEUTRAL
}

model User {
  id           String       @id @default(cuid())
  name         String
  email        String       @unique
  passwordHash String
  role         Role         @default(USER)
  datasets     Dataset[]
  experiments  Experiment[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

model Dataset {
  id           String          @id @default(cuid())
  name         String
  description  String?
  source       String?
  sampleCount  Int             @default(0)
  featureCount Int             @default(0)
  isDemo       Boolean         @default(false)
  ownerId      String
  owner        User            @relation(fields: [ownerId], references: [id])
  samples      DatasetSample[]
  experiments  Experiment[]
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt
  @@index([ownerId])
}

model DatasetSample {
  id        String      @id @default(cuid())
  datasetId String
  dataset   Dataset     @relation(fields: [datasetId], references: [id], onDelete: Cascade)
  label     SampleLabel
  features  Json
  createdAt DateTime    @default(now())
  @@index([datasetId])
  @@index([label])
}

model Experiment {
  id                    String           @id @default(cuid())
  name                  String
  status                ExperimentStatus  @default(PENDING)
  datasetId             String
  dataset               Dataset          @relation(fields: [datasetId], references: [id])
  userId                String
  user                  User             @relation(fields: [userId], references: [id])
  attackType            AttackType?
  robustnessScore       Float?
  attackSuccessRate     Float?
  detectionRetention    Float?
  configuration         Json?
  summary               Json?
  attackResults         AttackResult[]
  defenseResults        DefenseResult[]
  featureContributions  FeatureContribution[]
  recommendation        Recommendation?
  report                Report?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  @@index([userId])
  @@index([datasetId])
  @@index([status])
}

model AttackResult {
  id                    String           @id @default(cuid())
  experimentId          String
  experiment            Experiment       @relation(fields: [experimentId], references: [id], onDelete: Cascade)
  attackType            AttackType
  sampleId              String?
  originalPrediction    SamplePrediction
  adversarialPrediction SamplePrediction
  originalScore         Float
  adversarialScore      Float
  attackSuccessful      Boolean
  changedFeatures       Json
  createdAt             DateTime @default(now())
  @@index([experimentId])
  @@index([attackType])
}

model DefenseResult {
  id                        String       @id @default(cuid())
  experimentId              String
  experiment               Experiment   @relation(fields: [experimentId], references: [id], onDelete: Cascade)
  defenseType               DefenseType
  cleanDetectionRate        Float
  adversarialDetectionRate  Float
  attackSuccessRate         Float
  robustnessScore           Float
  processingTimeMs          Float?
  estimatedCost             Float?
  configuration             Json?
  metrics                   Json?
  createdAt                 DateTime @default(now())
  @@index([experimentId])
  @@index([defenseType])
}

model FeatureContribution {
  id            String     @id @default(cuid())
  experimentId  String
  experiment    Experiment @relation(fields: [experimentId], references: [id], onDelete: Cascade)
  featureName   String
  originalValue Json?
  modifiedValue Json?
  contribution Float
  importance    Float
  direction     ContributionDirection
  createdAt     DateTime @default(now())
  @@index([experimentId])
  @@index([featureName])
}

model Recommendation {
  id                 String      @id @default(cuid())
  experimentId       String      @unique
  experiment         Experiment  @relation(fields: [experimentId], references: [id], onDelete: Cascade)
  recommendedDefense DefenseType
  confidence         Float
  reasoning          String
  observedWeaknesses Json
  ranking             Json?
  createdAt           DateTime @default(now())
}

model Report {
  id           String     @id @default(cuid())
  experimentId String     @unique
  experiment   Experiment @relation(fields: [experimentId], references: [id], onDelete: Cascade)
  title        String
  reportData   Json
  htmlContent  String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## Indexes
Index user email, dataset owner, dataset samples by dataset/label, experiments by user/dataset/status, and experiment result tables by experiment.

## Transactions
Use Prisma transactions for complete demo pipeline, experiment creation, defense comparison, recommendation, and report generation.

## Integrity
Deleting an experiment cascades its results/recommendation/report. Deleting a dataset cascades its samples. Do not cascade-delete users.

## Seed
Create:
- demo analyst user
- ARES Demonstration Dataset
- deterministic synthetic samples
- completed demo experiments
- real engine-generated metrics
- recommendation
- report

Never store executable binaries, passwords, private keys, or authentication secrets.
