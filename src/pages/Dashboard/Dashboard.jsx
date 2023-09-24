import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  AutoComplete,
  Input,
  Progress,
  Space,
  Modal,
  Form,
  Button,
  InputNumber,
} from "antd";
import SampleDataPersonalInfo from "./SampleDataPersonalInfo";
import SampleDataFoodEaten from "../FoodEatenPage/SampleDataFoodEaten";
import "./Dashboard.css";

const { TextArea } = Input;

const Dashboard = () => {
  const [currWeight, setCurrWeight] = useState(72);
  const [targetCalorie, setTargetCalorie] = useState(1900);
  const [currCalorie, setCurrCalorie] = useState(0);
  const [currBMI, setCurrBMI] = useState(
    parseFloat((SampleDataPersonalInfo.height / currWeight).toFixed(2))
  );
  const [currEvaluatedBMI, setCurrEvaluatedBMI] = useState("Healthy");
  const [progressPercent, setProgressPercent] = useState(0);
  const [foodEaten, setFoodEaten] = useState([]);
  const [foodItems, setFoodItems] = useState(SampleDataFoodEaten);

  useEffect(() => {
    setCurrBMI(
      parseFloat((SampleDataPersonalInfo.height / currWeight).toFixed(2))
    );
    setCurrEvaluatedBMI(
      currBMI <= 18.5
        ? "Underweight"
        : currBMI <= 24.9
        ? "Healthy"
        : currBMI <= 29.9
        ? "Overweight"
        : "Obese"
    );

    if (foodEaten) {
      let totalCalories = 0;

      for (const eaten of foodEaten) {
        const foodInfo = foodItems.find((food) => food.food === eaten.food);

        if (foodInfo) {
          const grams = eaten.quantity;

          const calories = grams * (foodInfo.caloriesPerGram / 1000);
          totalCalories += calories;
        }
      }
      setCurrCalorie(totalCalories);
      const newProgressPercent = parseInt(
        (100 * (currCalorie / targetCalorie)).toFixed(0)
      );
      setProgressPercent(newProgressPercent);
    } else {
      setCurrCalorie(0);
      setProgressPercent(0);
    }

    console.log(progressPercent);

    console.log(foodEaten);
    console.log(foodItems);
  }, [foodItems, foodEaten, currWeight, currBMI, targetCalorie]);

  const [selectedFood, setSelectedFood] = useState("");
  const [quantity, setQuantity] = useState(undefined);
  const [isQuantityInputVisible, setIsQuantityInputVisible] = useState(false);
  const handleFoodSelect = (value) => {
    setSelectedFood(value);
    setIsQuantityInputVisible(true);
  };

  const handleQuantityStep = (value, { type }) => {
    if (value !== undefined) {
      if (type === "up") {
        setQuantity((prevQuantity) => (prevQuantity || 0) + 50);
      } else {
        setQuantity((prevQuantity) => (prevQuantity || 0) - 50);
      }
    }
  };

  const handleAddFood = () => {
    if (selectedFood && quantity !== undefined) {
      const foodItem = { food: selectedFood, quantity };
      setFoodEaten([...foodEaten, foodItem]);
    }

    setSelectedFood("");
    setQuantity(undefined);
    setIsQuantityInputVisible(false);
  };

  const options = foodItems.map((item) => ({ value: item.food }));

  ///
  const [isNewFoodModalVisible, setIsNewFoodModalVisible] = useState(false);
  const [newFoodFormData, setNewFoodFormData] = useState({
    food: "",
    caloriesPerGram: "",
    protein: "",
    fat: "",
    fiber: "",
    carbs: "",
    caloriesUnit: "kJ",
    proteinUnit: "gm",
    fatUnit: "gm",
    fiberUnit: "gm",
    carbsUnit: "gm",
  });

  const showNewFoodModal = () => {
    setIsNewFoodModalVisible(true);
  };

  const handleNewFoodOk = () => {
    function capitalizeWords(input) {
      const words = input.split(" ");

      const capitalizedWords = words.map((word) => {
        if (word.length > 0) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      });

      const output = capitalizedWords.join(" ");

      return output;
    }

    const newFoodItem = {
      ...newFoodFormData,
      food: capitalizeWords(newFoodFormData.food),
    };
    setFoodItems([...foodItems, newFoodItem]);

    setNewFoodFormData({
      food: "",
      caloriesPerGram: "",
      protein: "",
      fat: "",
      fiber: "",
      carbs: "",
      caloriesUnit: "kJ",
      proteinUnit: "gm",
      fatUnit: "gm",
      fiberUnit: "gm",
      carbsUnit: "gm",
    });

    // Close the modal
    setIsNewFoodModalVisible(false);
  };

  const handleNewFoodCancel = () => {
    setIsNewFoodModalVisible(false);
  };

  const [areThereOptions, setAreThereOptions] = useState(false);

  return (
    <div className="dashboard">
      <Card style={{ width: 300, margin: "4px" }} hoverable={true}>
        <div className="card-1-content">
          <div className="classOne">
            <div className="weight">WEIGHT</div>
            <div className="currWeight">{currWeight}</div>
          </div>
          <div className="classTwo">
            <div className="circle">
              <div className="BMI">BMI</div>
              <div className="BMICalculated">{currBMI}</div>
              <div className="BMIEvaluated">{currEvaluatedBMI}</div>
            </div>
          </div>
        </div>
      </Card>
      <Card style={{ width: 300 }} hoverable={true}>
        <div className="card-2-content">
          <div className="addFood">
            <AutoComplete
              style={{ width: 300 }}
              options={options}
              placeholder="Add Food"
              filterOption={(inputValue, option) =>
                option &&
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                  -1
              }
              onSelect={handleFoodSelect}
              value={selectedFood}
              onChange={(value) => {
                setSelectedFood(value);
                setAreThereOptions(
                  options.filter(
                    (option) =>
                      option.value
                        .toUpperCase()
                        .indexOf(selectedFood.toUpperCase()) !== -1
                  ).length > 0
                );
              }}
            />
            {isQuantityInputVisible && (
              <InputNumber
                style={{ width: 200, marginLeft: 10 }}
                placeholder="Quantity (gm)"
                min={0}
                value={quantity}
                onStep={handleQuantityStep}
                formatter={(value) => (value ? `${value} gm` : ``)}
              />
            )}
            {isQuantityInputVisible && (
              <Button type="primary" onClick={handleAddFood}>
                +
              </Button>
            )}
            {selectedFood !== "" &&
              !areThereOptions &&
              !foodItems.some((item) => item.food === selectedFood) && (
                <Button type="default" onClick={showNewFoodModal}>
                  Add New Food
                </Button>
              )}
          </div>
          <Modal
            title="Add New Food Item"
            open={isNewFoodModalVisible}
            onOk={handleNewFoodOk}
            onCancel={handleNewFoodCancel}
          >
            <Form layout="vertical">
              {" "}
              <Form.Item label="Food">
                <Input
                  value={newFoodFormData.food}
                  onChange={(e) =>
                    setNewFoodFormData({
                      ...newFoodFormData,
                      food: e.target.value,
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="Calories per Gram">
                <InputNumber
                  value={newFoodFormData.caloriesPerGram}
                  onChange={(value) =>
                    setNewFoodFormData({
                      ...newFoodFormData,
                      caloriesPerGram: value,
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="Protein">
                <InputNumber
                  value={newFoodFormData.protein}
                  onChange={(value) =>
                    setNewFoodFormData({ ...newFoodFormData, protein: value })
                  }
                />
              </Form.Item>
              <Form.Item label="Fat">
                <InputNumber
                  value={newFoodFormData.fat}
                  onChange={(value) =>
                    setNewFoodFormData({ ...newFoodFormData, fat: value })
                  }
                />
              </Form.Item>
              <Form.Item label="Fiber">
                <InputNumber
                  value={newFoodFormData.fiber}
                  onChange={(value) =>
                    setNewFoodFormData({ ...newFoodFormData, fiber: value })
                  }
                />
              </Form.Item>
              <Form.Item label="Carbs">
                <InputNumber
                  value={newFoodFormData.carbs}
                  onChange={(value) =>
                    setNewFoodFormData({ ...newFoodFormData, carbs: value })
                  }
                />
              </Form.Item>
            </Form>
          </Modal>

          <Link to="/FoodEatenPage">
            <Progress strokeLinecap="butt" percent={progressPercent} />
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
