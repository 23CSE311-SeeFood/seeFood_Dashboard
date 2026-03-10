export const customerFeedback = [
  {
    id: 1,
    name: "Rajesh Kumar",
    rating: 5,
    feedback: "Excellent food quality and service. The biryani was absolutely delicious!",
    date: "2026-03-10",
    item: "Biryani",
    avatar: "RK"
  },
  {
    id: 2,
    name: "Priya Singh",
    rating: 4,
    feedback: "Great taste, but the order took a bit longer than expected. Good quality overall.",
    date: "2026-03-09",
    item: "Butter Chicken",
    avatar: "PS"
  },
  {
    id: 3,
    name: "Amit Patel",
    rating: 5,
    feedback: "Amazing! The paneer tikka is my favorite. Perfect spice level and freshness.",
    date: "2026-03-08",
    item: "Paneer Tikka",
    avatar: "AP"
  },
  {
    id: 4,
    name: "Neha Gupta",
    rating: 3,
    feedback: "Average taste. The dal makhani could use more flavor. Will try other items next time.",
    date: "2026-03-07",
    item: "Dal Makhani",
    avatar: "NG"
  },
  {
    id: 5,
    name: "Vikas Sharma",
    rating: 5,
    feedback: "Fantastic service and delicious food. The vegetable samosa is crispy and perfect!",
    date: "2026-03-06",
    item: "Vegetable Samosa",
    avatar: "VS"
  },
  {
    id: 6,
    name: "Anjali Rao",
    rating: 4,
    feedback: "Very good quality and reasonable prices. The chole bhature was soft and fluffy.",
    date: "2026-03-05",
    item: "Chole Bhature",
    avatar: "AR"
  },
  {
    id: 7,
    name: "Deepak Singh",
    rating: 5,
    feedback: "Outstanding! The tandoori chicken is perfectly cooked. Will definitely order again.",
    date: "2026-03-04",
    item: "Tandoori Chicken",
    avatar: "DS"
  },
  {
    id: 8,
    name: "Meera Verma",
    rating: 2,
    feedback: "Not satisfied with the taste. The momo filling was bland. Needs improvement.",
    date: "2026-03-03",
    item: "Momos",
    avatar: "MV"
  },
  {
    id: 9,
    name: "Arjun Nair",
    rating: 4,
    feedback: "Good food with nice presentation. The fried rice was well-cooked and tasty.",
    date: "2026-03-02",
    item: "Fried Rice",
    avatar: "AN"
  },
  {
    id: 10,
    name: "Shalini Desai",
    rating: 5,
    feedback: "Perfect! The masala dosa is crispy, the sambar is flavorful. Highly recommended!",
    date: "2026-03-01",
    item: "Masala Dosa",
    avatar: "SD"
  }
];

export const getAverageRating = () => {
  const sum = customerFeedback.reduce((acc, curr) => acc + curr.rating, 0);
  return (sum / customerFeedback.length).toFixed(1);
};

export const getRatingDistribution = () => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  customerFeedback.forEach(feedback => {
    distribution[feedback.rating]++;
  });
  return distribution;
};
