# ARES — Database Schema & Architecture

## Database
MongoDB accessed exclusively through Mongoose ODM.

## Architecture
```text
React → Express → Services → Engines → Mongoose → MongoDB
```

## Relationships
```text
User
 ├── Dataset (ownerId -> User._id)
 └── Experiment (userId -> User._id)
       ├── AttackResult (experimentId -> Experiment._id)
       ├── DefenseResult (experimentId -> Experiment._id)
       ├── FeatureContribution (experimentId -> Experiment._id)
       ├── Recommendation (experimentId -> Experiment._id)
       └── Report (experimentId -> Experiment._id)

Dataset
 └── DatasetSample (datasetId -> Dataset._id)
```

---

## Enumerations & Types

```typescript
export enum Role {
  ADMIN = 'ADMIN',
  ANALYST = 'ANALYST',
  USER = 'USER'
}

export enum SampleLabel {
  MALWARE = 'MALWARE',
  BENIGN = 'BENIGN'
}

export enum ExperimentStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum AttackType {
  PADDING = 'PADDING',
  GAMMA_INSPIRED = 'GAMMA_INSPIRED'
}

export enum SamplePrediction {
  MALWARE = 'MALWARE',
  BENIGN = 'BENIGN'
}

export enum DefenseType {
  BASELINE = 'BASELINE',
  ADVERSARIAL_TRAINING_SIMULATION = 'ADVERSARIAL_TRAINING_SIMULATION',
  MONOTONIC_CONSTRAINT_SIMULATION = 'MONOTONIC_CONSTRAINT_SIMULATION'
}

export enum ContributionDirection {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL'
}
```

---

## Mongoose Schemas & Models

### 1. User Model (`server/src/models/User.ts`)
```typescript
import mongoose, { Schema, Document } from 'mongoose';
import { Role } from '../types';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.USER }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
```

### 2. Dataset Model (`server/src/models/Dataset.ts`)
```typescript
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDataset extends Document {
  name: string;
  description?: string;
  source?: string;
  sampleCount: number;
  featureCount: number;
  isDemo: boolean;
  ownerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DatasetSchema = new Schema<IDataset>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    source: { type: String, default: '' },
    sampleCount: { type: Number, default: 0 },
    featureCount: { type: Number, default: 0 },
    isDemo: { type: Boolean, default: false, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }
  },
  { timestamps: true }
);

export const Dataset = mongoose.model<IDataset>('Dataset', DatasetSchema);
```

### 3. DatasetSample Model (`server/src/models/DatasetSample.ts`)
```typescript
import mongoose, { Schema, Document, Types } from 'mongoose';
import { SampleLabel } from '../types';

export interface IDatasetSample extends Document {
  datasetId: Types.ObjectId;
  label: SampleLabel;
  features: Record<string, number>;
  createdAt: Date;
}

const DatasetSampleSchema = new Schema<IDatasetSample>(
  {
    datasetId: { type: Schema.Types.ObjectId, ref: 'Dataset', required: true, index: true },
    label: { type: String, enum: Object.values(SampleLabel), required: true, index: true },
    features: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

DatasetSampleSchema.index({ datasetId: 1, label: 1 });

export const DatasetSample = mongoose.model<IDatasetSample>('DatasetSample', DatasetSampleSchema);
```

### 4. Experiment Model (`server/src/models/Experiment.ts`)
```typescript
import mongoose, { Schema, Document, Types } from 'mongoose';
import { ExperimentStatus, AttackType } from '../types';

export interface IExperiment extends Document {
  name: string;
  status: ExperimentStatus;
  datasetId: Types.ObjectId;
  userId: Types.ObjectId;
  attackType?: AttackType;
  robustnessScore?: number;
  attackSuccessRate?: number;
  detectionRetention?: number;
  configuration?: Record<string, any>;
  summary?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ExperimentSchema = new Schema<IExperiment>(
  {
    name: { type: String, required: true, trim: true },
    status: { type: String, enum: Object.values(ExperimentStatus), default: ExperimentStatus.PENDING, index: true },
    datasetId: { type: Schema.Types.ObjectId, ref: 'Dataset', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    attackType: { type: String, enum: Object.values(AttackType) },
    robustnessScore: { type: Number },
    attackSuccessRate: { type: Number },
    detectionRetention: { type: Number },
    configuration: { type: Schema.Types.Mixed },
    summary: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const Experiment = mongoose.model<IExperiment>('Experiment', ExperimentSchema);
```

### 5. AttackResult Model (`server/src/models/AttackResult.ts`)
```typescript
import mongoose, { Schema, Document, Types } from 'mongoose';
import { AttackType, SamplePrediction } from '../types';

export interface IAttackResult extends Document {
  experimentId: Types.ObjectId;
  attackType: AttackType;
  sampleId?: string;
  originalPrediction: SamplePrediction;
  adversarialPrediction: SamplePrediction;
  originalScore: number;
  adversarialScore: number;
  attackSuccessful: boolean;
  changedFeatures: Record<string, { original: number; modified: number }>;
  createdAt: Date;
}

const AttackResultSchema = new Schema<IAttackResult>(
  {
    experimentId: { type: Schema.Types.ObjectId, ref: 'Experiment', required: true, index: true },
    attackType: { type: String, enum: Object.values(AttackType), required: true, index: true },
    sampleId: { type: String },
    originalPrediction: { type: String, enum: Object.values(SamplePrediction), required: true },
    adversarialPrediction: { type: String, enum: Object.values(SamplePrediction), required: true },
    originalScore: { type: Number, required: true },
    adversarialScore: { type: Number, required: true },
    attackSuccessful: { type: Boolean, required: true },
    changedFeatures: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AttackResult = mongoose.model<IAttackResult>('AttackResult', AttackResultSchema);
```

### 6. DefenseResult Model (`server/src/models/DefenseResult.ts`)
```typescript
import mongoose, { Schema, Document, Types } from 'mongoose';
import { DefenseType } from '../types';

export interface IDefenseResult extends Document {
  experimentId: Types.ObjectId;
  defenseType: DefenseType;
  cleanDetectionRate: number;
  adversarialDetectionRate: number;
  attackSuccessRate: number;
  robustnessScore: number;
  processingTimeMs?: number;
  estimatedCost?: number;
  configuration?: Record<string, any>;
  metrics?: Record<string, any>;
  createdAt: Date;
}

const DefenseResultSchema = new Schema<IDefenseResult>(
  {
    experimentId: { type: Schema.Types.ObjectId, ref: 'Experiment', required: true, index: true },
    defenseType: { type: String, enum: Object.values(DefenseType), required: true, index: true },
    cleanDetectionRate: { type: Number, required: true },
    adversarialDetectionRate: { type: Number, required: true },
    attackSuccessRate: { type: Number, required: true },
    robustnessScore: { type: Number, required: true },
    processingTimeMs: { type: Number },
    estimatedCost: { type: Number },
    configuration: { type: Schema.Types.Mixed },
    metrics: { type: Schema.Types.Mixed }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const DefenseResult = mongoose.model<IDefenseResult>('DefenseResult', DefenseResultSchema);
```

### 7. FeatureContribution Model (`server/src/models/FeatureContribution.ts`)
```typescript
import mongoose, { Schema, Document, Types } from 'mongoose';
import { ContributionDirection } from '../types';

export interface IFeatureContribution extends Document {
  experimentId: Types.ObjectId;
  featureName: string;
  originalValue?: any;
  modifiedValue?: any;
  contribution: number;
  importance: number;
  direction: ContributionDirection;
  createdAt: Date;
}

const FeatureContributionSchema = new Schema<IFeatureContribution>(
  {
    experimentId: { type: Schema.Types.ObjectId, ref: 'Experiment', required: true, index: true },
    featureName: { type: String, required: true, index: true },
    originalValue: { type: Schema.Types.Mixed },
    modifiedValue: { type: Schema.Types.Mixed },
    contribution: { type: Number, required: true },
    importance: { type: Number, required: true },
    direction: { type: String, enum: Object.values(ContributionDirection), required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const FeatureContribution = mongoose.model<IFeatureContribution>('FeatureContribution', FeatureContributionSchema);
```

### 8. Recommendation Model (`server/src/models/Recommendation.ts`)
```typescript
import mongoose, { Schema, Document, Types } from 'mongoose';
import { DefenseType } from '../types';

export interface IRecommendation extends Document {
  experimentId: Types.ObjectId;
  recommendedDefense: DefenseType;
  confidence: number;
  reasoning: string;
  observedWeaknesses: string[];
  ranking?: Array<{ defense: DefenseType; score: number; rank: number }>;
  createdAt: Date;
}

const RecommendationSchema = new Schema<IRecommendation>(
  {
    experimentId: { type: Schema.Types.ObjectId, ref: 'Experiment', required: true, unique: true, index: true },
    recommendedDefense: { type: String, enum: Object.values(DefenseType), required: true },
    confidence: { type: Number, required: true },
    reasoning: { type: String, required: true },
    observedWeaknesses: { type: Schema.Types.Mixed, default: [] },
    ranking: { type: Schema.Types.Mixed }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Recommendation = mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
```

### 9. Report Model (`server/src/models/Report.ts`)
```typescript
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReport extends Document {
  experimentId: Types.ObjectId;
  title: string;
  reportData: Record<string, any>;
  htmlContent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    experimentId: { type: Schema.Types.ObjectId, ref: 'Experiment', required: true, unique: true, index: true },
    title: { type: String, required: true },
    reportData: { type: Schema.Types.Mixed, required: true },
    htmlContent: { type: String }
  },
  { timestamps: true }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
```

---

## Indexes Summary
* **User**: `email` (unique index)
* **Dataset**: `ownerId`, `isDemo`
* **DatasetSample**: `datasetId`, `label`, compound index `{ datasetId: 1, label: 1 }`
* **Experiment**: `userId`, `datasetId`, `status`
* **AttackResult**: `experimentId`, `attackType`
* **DefenseResult**: `experimentId`, `defenseType`
* **FeatureContribution**: `experimentId`, `featureName`
* **Recommendation**: `experimentId` (unique index)
* **Report**: `experimentId` (unique index)

---

## Transactions
Use Mongoose sessions and transactions (`await mongoose.startSession()`) for atomic multi-document operations such as:
- Complete demo pipeline execution
- Experiment creation and batch result population
- Defense comparison and multi-defense persistence
- Experiment deletion and cascading cleanup

Example:
```typescript
const session = await mongoose.startSession();
session.startTransaction();
try {
  // perform operations passing { session }
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

---

## Integrity & Cascading
- Deleting an `Experiment` cascades deletion of its associated `AttackResult`, `DefenseResult`, `FeatureContribution`, `Recommendation`, and `Report` records.
- Deleting a `Dataset` cascades deletion of its associated `DatasetSample` records.
- Deleting a `User` should never delete public or shared demo datasets; user-owned records must be handled via business services.

---

## Seed Specification
The database seed script (`server/src/seed.ts`) initializes MongoDB with:
- Demo analyst user
- ARES Demonstration Dataset
- Deterministic synthetic feature samples
- Completed baseline demo experiments
- Real engine-generated evaluation metrics
- Demo recommendations
- Demo audit report

---

## Security
Never store executable binaries, raw malware, plaintext passwords, private keys, or authentication secrets in MongoDB documents.
