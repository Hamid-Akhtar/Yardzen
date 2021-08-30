import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { TextField, Button, Card, CardContent } from "@material-ui/core";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

import { doc, setDoc } from "firebase/firestore";
import Header from "../component/Header";

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: "flex",
    width: "500px",
    marginTop: "10px",
  },
}));

const firebaseConfig = {
  apiKey: "AIzaSyD7NUVfrImccSo8FuCBG7bXVk0oLFqgE-k",
  authDomain: "yardzen-demo.firebaseapp.com",
  databaseURL: "https://yardzen-demo.firebaseio.com",
  projectId: "yardzen-demo",
  storageBucket: "yardzen-demo.appspot.com",
  messagingSenderId: "509183652730",
  appId: "1:509183652730:web:ba2208f7d8e0882f009cc3",
};
interface Item {
  type: string;
  name: string;
  lowPrice: number;
  highPrice: number;
}
function Home() {
  const classes = useStyles();
  const [selectedItems, setSelectedItems] = useState<Array<any>>([]);
  const [budget, setBudget] = useState<Number>(0);
  const [status, setStatus] = useState<string>("");
  const [show, setShow] = useState<Boolean>(false);
  const [arrData, setArrData] = useState<Array<any>>([]);
  const [itemData, setItemsData] = useState<Array<any>>([]);
  const unique: Array<any> = Array.from(new Set(itemData.map((item) => item.type))) as Array<any>
  const [inputError, setInputError] = useState("");

  const getDBData = async () => {
    const app = await initializeApp(firebaseConfig);
    const db = await getFirestore(app);
    let itemsCol = await collection(db, "items");
    const itemsSnapshot = await getDocs(itemsCol);
    const itemsList: Array<Item> = itemsSnapshot.docs.map((doc: any) => doc.data());
    setItemsData(itemsList);
  };

  const HandleUnique = () => {
    if (unique) {
      unique.map((um: string) => {
        let arr: any = [];
        itemData.map((items: any) => {
          if (items.type === um) {
            items.lowPrice = parseFloat(
              items.lowPrice
                .toString()
                .substring(0, items.lowPrice.toString().length - 2) +
              "." +
              items.lowPrice
                .toString()
                .substring(items.lowPrice.toString().length - 2)
            ).toFixed(2);
            items.highPrice = parseFloat(
              items.highPrice
                .toString()
                .substring(0, items.highPrice.toString().length - 2) +
              "." +
              items.highPrice
                .toString()
                .substring(items.highPrice.toString().length - 2)
            ).toFixed(2);
            arr.push(items);
          }
        });
        formattedData.push({ type: um, items: arr });
      });
      setArrData(formattedData);
    }
  };

  useEffect(() => {
    getDBData();
    if (budget <= 0) {
      setInputError("Kindly enter value greater than 0");
    } else {
      setInputError("");
    }
  }, [budget]);


  const handleChange = async (event: any, items: any, index: any, i: any) => {
    const listArray = selectedItems.filter(
      (select: any) => select.type !== items.type
    );
    await setSelectedItems([...listArray, items]);
  };
  var min = selectedItems.reduce((a: any, b: any) => +a + +b.lowPrice, 0).toFixed(2);
  var max = selectedItems.reduce((a: any, b: any) => +a + +b.highPrice, 0).toFixed(2);
  let formattedData: any = [];

  const handleClick = (e: any) => {
    setShow(true);
    e.preventDefault();
  };

  useEffect(() => {
    HandleUnique();
  }, [itemData]);

  useEffect(() => {
    if (budget < 0) {
      setInputError("Kindly enter value greater than 0");
    } else {
      setInputError("");
    }
  }, [budget]);

  useEffect(() => {
    if (
      budget > min && budget <= max
    ) {
      setStatus("Budget is within the range");
    } else if (budget > max) {
      setStatus("Budget is over the range");
    } else if (budget <= min) {
      setStatus("Budget is Under the range");
    }
  }, [min, max]);

  const handleSubmit = async () => {
    const app = await initializeApp(firebaseConfig);
    const db = await getFirestore(app);
    await setDoc(
      doc(db, "HamidAkhtarBudgetResponses", `test ${Math.random() * 1000}`),
      {
        status: status,
        minimum: min,
        maximum: max,
        selectedItems: selectedItems,
      }
    )
      .then(async () => {
        setBudget(0);
        min=0;
        max=0;
        setSelectedItems([])
        toast.success("Data Successfully added");
        setShow(false);
        let it = await collection(db, "HamidAkhtarBudgetResponses");
        const itemsSnapshot = await getDocs(it);
        const itemsList = itemsSnapshot.docs.map((doc) => doc.data());
         console.log("itemsList>>", itemsList)
      })
      .catch((err: any) => {
        console.log("error", err);
      });
  };
  return (
    <>
      <Header />
      <div>
        {show && arrData ? (
          <>
            <div style={{ display: "flex", marginTop: "10px" }}>
              <div
                style={{ width: "70%", height: "100vh", overflowY: "scroll" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h2>Items</h2>
                  {arrData.map((data: any, index: any) => (
                    <Card key={index} className={classes.root}>
                      <CardContent style={{ width: "100%" }}>
                        <p>{data.type}</p>
                        <ul>
                          {data?.items?.map((d: any, i: any) => {
                            return (
                              <li
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                                key={i}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <input
                                    type="radio"
                                    name={`${d.type}`}
                                    value={d}
                                    onChange={(e) =>
                                      handleChange(e, d, index, i)
                                    }
                                  />

                                  <p>{d.name}</p>
                                </div>

                                <p>
                                  ${d.lowPrice} - ${d.highPrice}
                                </p>
                              </li>
                            );
                          })}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}{" "}
                  <Button
                    style={{
                      marginTop: "20px", marginBottom: "20px", color: "white",
                      backgroundColor: "black",
                    }}
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={selectedItems?.length > 0 ? false : true}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>{" "}
              </div>
              <div style={{ display: "flex", flex: 0.25 }}>
                <Card style={{ position: "fixed", padding: "20px" }}>
                  <p>
                    {" "}
                    Selected Item: ${min} - ${max}
                  </p>
                  <p>Budget : ${budget}</p>
                  <p>Status : {status}</p>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <form>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <TextField
                  id="standard-number"
                  label="Enter Your Budget"
                  style={{ width: "400px" }}
                  type="number"
                  variant="outlined"
                  color="secondary"
                  onChange={(e) => setBudget(parseFloat(e.target.value))}
                />
                <p style={{ fontSize: "10px", color: "red" }}>{inputError}</p>
              </div>
              <Button
                type="submit"
                variant="contained"
                style={{
                  marginTop: "10px",
                  color: "white",
                  backgroundColor: "black",
                }}
                color="primary"
                disabled={budget <=0 ? true : false}
                onClick={handleClick}
              >
                Submit
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default Home;
