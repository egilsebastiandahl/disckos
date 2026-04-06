export type ShotData = {
  category: string;
  items: { title: string; isActive: boolean }[];
};

export const shotData: ShotData[] = [
  {
    category: "Disctype",
    items: [
      {
        title: "Putter",
        isActive: true,
      },
      {
        title: "Midrange",
        isActive: true,
      },
      {
        title: "Fairway",
        isActive: true,
      },
      {
        title: "Driver",
        isActive: true,
      },
      {
        title: "Fritt valg",
        isActive: true,
      },
    ],
  },
  {
    category: "Stabilitet",
    items: [
      {
        title: "Overstabil",
        isActive: true,
      },
      {
        title: "Stabil",
        isActive: true,
      },
      {
        title: "Understabil",
        isActive: true,
      },
      {
        title: "Fritt valg",
        isActive: true,
      },
    ],
  },
  {
    category: "Type",
    items: [
      {
        title: "Hyzer",
        isActive: true,
      },
      {
        title: "Rett",
        isActive: true,
      },
      {
        title: "Anhyzer",
        isActive: true,
      },
       {
        title: "Tomahawk",
        isActive: true,
      },
      {
        title: "Granat",
        isActive: true,
      },
      {
        title: "Roller",
        isActive: true,
      },
      {
        title: "Opp-ned",
        isActive: true,
      },
      {
        title: "Fritt valg",
        isActive: true,
      },
    ],
  },
  {
    category: "Kastemåte",
    items: [
      {
        title: "Backhand",
        isActive: true,
      },
      {
        title: "Forehand",
        isActive: true,
      },
     {
        title: "Fritt valg",
        isActive: true,
      },
      
    ],
  },
  {
    category: "Ekstra",
    items: [
      {
        title: "Skeivhendt",
        isActive: true,
      },
      {
        title: "360-spin",
        isActive: true,
      },
      {
        title: "Blindt",
        isActive: true,
      },
      {
        title: "Roller",
        isActive: true,
      },
      {
        title: "Gå for kurv, ikke legg opp",
        isActive: true,
      },
      {
        title: "Hyzer spike",
        isActive: true,
      },
      {
        title: "Flex shot",
        isActive: true,
      },
      {
        title: "Konkurrent velger",
        isActive: true,
      },
      {
        title: "MAX POWER",
        isActive: true,
      },
      {
        title: "Fritt valg",
        isActive: true,
      },
    ],
  },
  {
    category: "Lag",
    items: [
      {
        title: "Kamerat velger",
        isActive: true,
      },
      {
        title: "Konkurrent velger",
        isActive: true,
      },
      {
        title: "Fritt valg",
        isActive: true,
      },
    ],
  },
];

// [
//
//   {
//     "Ekstra": [
//       {
//         "Venstre hånd": true
//       },
//       { "Høyre hånd": true },
//       { "360-spin": true },
//       { "Blindt": true },
//       { "Gå for kurv, ikke legg opp": true }
//     ]
//   }
// ]
