export type Task = {
    id: string;
    category: "Medical AI" | "Autonomous Driving" | "Content Moderation";
    imageUrl: string;
    question: string;
    options: [string, string];
    correctOption: string;
};

export const TASKS: Task[] = [
    // Medical AI - Lung Scans
    {
        id: "med-1",
        category: "Medical AI",
        imageUrl: "https://placehold.co/600x400/222/FFF?text=LUNG+SCAN:+CLEAR",
        question: "Is there an anomaly in this lung scan?",
        options: ["Normal", "Anomaly Detected"],
        correctOption: "Normal",
    },
    {
        id: "med-2",
        category: "Medical AI",
        imageUrl: "https://placehold.co/600x400/333/FFF?text=LUNG+SCAN:+ANOMALY",
        question: "Identify the scan condition.",
        options: ["Normal", "Anomaly Detected"],
        correctOption: "Anomaly Detected",
    },
    {
        id: "med-3",
        category: "Medical AI",
        imageUrl: "https://placehold.co/600x400/222/FFF?text=MRI+BRAIN:+TUMOR",
        question: "What does this MRI show?",
        options: ["Healthy Tissue", "Tumor Presence"],
        correctOption: "Tumor Presence",
    },

    // Autonomous Driving
    {
        id: "auto-1",
        category: "Autonomous Driving",
        imageUrl: "https://placehold.co/600x400/1e293b/FFF?text=STOP+SIGN",
        question: "What traffic sign is visible?",
        options: ["Stop Sign", "Yield Sign"],
        correctOption: "Stop Sign",
    },
    {
        id: "auto-2",
        category: "Autonomous Driving",
        imageUrl: "https://placehold.co/600x400/1e293b/FFF?text=PEDESTRIAN",
        question: "Identify the obstacle.",
        options: ["Vehicle", "Pedestrian"],
        correctOption: "Pedestrian",
    },
    {
        id: "auto-3",
        category: "Autonomous Driving",
        imageUrl: "https://placehold.co/600x400/1e293b/FFF?text=RED+LIGHT",
        question: "What is the traffic light state?",
        options: ["Green", "Red"],
        correctOption: "Red",
    },

    // Content Moderation
    {
        id: "mod-1",
        category: "Content Moderation",
        imageUrl: "https://placehold.co/600x400/aa0000/FFF?text=HATE+SPEECH+TEXT",
        question: "Does this contain harmful content?",
        options: ["Safe", "Toxic/Harmful"],
        correctOption: "Toxic/Harmful",
    },
    {
        id: "mod-2",
        category: "Content Moderation",
        imageUrl: "https://placehold.co/600x400/00aa00/FFF?text=FRIENDLY+GREETING",
        question: "Assess the sentiment.",
        options: ["Positive", "Negative"],
        correctOption: "Positive",
    },
    {
        id: "mod-3",
        category: "Content Moderation",
        imageUrl: "https://placehold.co/600x400/aa0000/FFF?text=VIOLENT+SCENE",
        question: "Flag this content.",
        options: ["Approved", "Violent"],
        correctOption: "Violent",
    },
];
