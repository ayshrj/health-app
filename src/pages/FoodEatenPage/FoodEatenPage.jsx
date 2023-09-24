import React from "react";
import { Card } from "antd";
import SampleDataFoodEaten from "./SampleDataFoodEaten";

const App = () => (
  <div>
    {SampleDataFoodEaten.map((item, index) => (
      <Card
        key={index}
        title={item.food}
        bordered={true}
        style={{ width: 300, margin: "16px" }}
      >
        <p style={{ fontSize: "20px" }}>Calories: {item.caloriesPerGram}</p>
        <p>Protein: {item.protein}</p>
        <p>Fat: {item.fat}</p>
        <p>Fiber: {item.fiber}</p>
        <p>Carbs: {item.carbs}</p>
      </Card>
    ))}
  </div>
);

export default App;
