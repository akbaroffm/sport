const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "src/data");

const enrichments = {
  gym: {
    area: [350, 800, 1200, 500, 650, 400, 1500],
    trainerCount: [8, 5, 12, 4, 10, 3, 15],
    established: [2018, 2020, 2016, 2021, 2019, 2022, 2015],
  },
  pool: {
    area: [1000, 600, 1500, 800, 500, 400],
    trainerCount: [4, 3, 8, 5, 2, 2],
    established: [2017, 2019, 2014, 2020, 2021, 2023],
  },
  yoga: {
    area: [200, 300, 150, 250, 120, 400],
    trainerCount: [6, 8, 3, 5, 2, 10],
    established: [2019, 2018, 2021, 2020, 2023, 2017],
  },
  football: {
    area: [3000, 4000, 2000, 5000, 2500, 3500],
    trainerCount: [6, 8, 4, 3, 5, 10],
    established: [2016, 2018, 2020, 2019, 2021, 2017],
  },
  tennis: {
    area: [2000, 1800, 1000, 2500, 800, 600],
    trainerCount: [5, 7, 3, 4, 3, 2],
    established: [2015, 2017, 2020, 2018, 2021, 2022],
  },
  badminton: {
    area: [600, 500, 400, 800, 300, 450],
    trainerCount: [4, 3, 2, 6, 2, 3],
    established: [2019, 2020, 2021, 2018, 2022, 2021],
  },
  cycling: {
    area: [300, 200, 800, 100, 400, 150],
    trainerCount: [5, 4, 7, 3, 6, 3],
    established: [2018, 2019, 2017, 2020, 2019, 2021],
  },
  climbing: {
    area: [600, 500, 400, 550, 200, 350],
    trainerCount: [6, 5, 3, 4, 8, 3],
    established: [2019, 2020, 2021, 2019, 2016, 2022],
  },
  "martial-arts": {
    area: [400, 600, 300, 350, 250, 500],
    trainerCount: [8, 12, 5, 6, 4, 7],
    established: [2014, 2018, 2020, 2017, 2021, 2019],
  },
  aerobics: {
    area: [250, 200, 180, 300, 350, 150],
    trainerCount: [5, 4, 3, 6, 4, 2],
    established: [2020, 2019, 2021, 2018, 2020, 2022],
  },
};

const tags = {
  gym: ["Fitnes", "Kuch", "Kardio"],
  pool: ["Suzish", "Aqua", "Basseyn"],
  yoga: ["Yoga", "Meditatsiya", "Moslashuvchanlik"],
  football: ["Futbol", "Jamoa", "Maydon"],
  tennis: ["Tennis", "Kort", "Raketka"],
  badminton: ["Badminton", "Tezkorlik"],
  cycling: ["Velosiped", "Kardio", "Sayohat"],
  climbing: ["Alpinizm", "Balandlik", "Kuch"],
  "martial-arts": ["Jang", "Himoya", "Kurash"],
  aerobics: ["Raqs", "Kardio", "Energiya"],
};

const files = {
  "gyms.json": "gym",
  "pools.json": "pool",
  "yogaStudios.json": "yoga",
  "football.json": "football",
  "tennis.json": "tennis",
  "badminton.json": "badminton",
  "cycling.json": "cycling",
  "climbing.json": "climbing",
  "martialArts.json": "martial-arts",
  "aerobics.json": "aerobics",
};

for (const [file, type] of Object.entries(files)) {
  const filePath = path.join(dataDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const enr = enrichments[type];

  data.forEach((item, i) => {
    item.isNew = i < 2;
    item.isVerified = i % 2 === 0;
    item.isFeatured = i === 0;
    item.area = enr.area[i] || 300;
    item.trainerCount = enr.trainerCount[i] || 3;
    item.established = enr.established[i] || 2020;
    item.tags = tags[type] || [];
    item.maxCapacity = Math.floor(
      item.area / (type === "football" ? 30 : type === "pool" ? 20 : 10),
    );
    item.languages = ["O'zbekcha", "Ruscha"];
    if (item.monthlyPrice > 400000) item.languages.push("English");
    item.socialMedia = {
      instagram: "@" + item.name.toLowerCase().replace(/[^a-z]/g, ""),
      telegram: "@" + item.id,
    };
    item.weekdayHours = item.openingHours;
    item.weekendHours = item.openingHours;
    item.features = item.services
      .slice(0, 2)
      .concat(item.amenities.slice(0, 2));
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log("Enriched:", file, "(" + data.length + " items)");
}
console.log("Done!");
