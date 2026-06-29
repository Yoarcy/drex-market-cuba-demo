-- CreateTable
CREATE TABLE "AdminWalletEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "beneficiaryName" TEXT,
    "senderName" TEXT,
    "assignedToName" TEXT,
    "assignedToRole" TEXT,
    "amount" INTEGER NOT NULL,
    "note" TEXT,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
