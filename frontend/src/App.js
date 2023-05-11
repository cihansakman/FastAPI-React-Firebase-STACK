
import React from 'react';
import { useState, useEffect } from "react";
import "./App.css";
import axios from 'axios';
import { Input, InputGroup } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import { Table, Button } from 'rsuite';
import { IconButton } from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';
//https://rsuitejs.com/components


const { Column, HeaderCell, Cell } = Table;

//SearchBox Styles
const styles = {
  width: 630,
  height: 40,
  marginBottom: 10,
  marginLeft:"auto",
  marginRight:"auto"
};

//Necesseary components to show summaries
const thousands = value => `${value}`.replace(/(?=(?!(\b))(\d{3})+$)/g, '$1,');
const HeaderSummary = ({ title, summary }) => (
  <div>
    <label>{title}</label>
    <div
      style={{
        fontSize: 18,
        color: '#2eabdf'
      }}
    >
      {thousands(summary)}
    </div>
  </div>
);

function App() {

  const [query, setQuery] = useState("")
  const [data, setData] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)


  //Cal data from backend
  useEffect(()=>{
    async function fetchDataFromAPI(){
      await axios.get('http://localhost:8000/api/item')
      .then(response => {
        console.log(response.data)
        setData(response.data)
      })
      .catch(error => console.log(error))
    }
    fetchDataFromAPI()
    console.log("DATA",data)
  },[searched])

  async function delete_item(item_name){
    setLoading(true)
    await axios.delete('http://localhost:8000/api/item', { data: { title: item_name }})
    .then(response => console.log(response))
    .catch(error => console.log(error));
    setSearched(!searched)
    setLoading(false)

  }

  async function searchQuery(searched_query){
    setLoading(true)
    await axios.post('http://localhost:8000/api/item', { query: searched_query })
    .then(response => console.log(response))
    .catch(error => console.log(error));
    setSearched(!searched)
    setLoading(false)
  }

  //Calculte total Calories and show it on the table.
  let calories = 0;
  let proteins = 0;
  let carbs = 0;
  let fats = 0;
  data.forEach(item => {
    calories += item.calories;
    proteins += item.protein;
    carbs += item.carbs_g;
    fats += item.fat;

  });

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#bbc9ca"
      }}
    >
      <div>
        <h3 style={{
          color:"white",
          marginBottom:"30px",
          textAlign:"center"

        }}>Search Your Meal and We'll List it For You</h3>
        <InputGroup style={styles}>
          <Input
            value={query}
            onChange={(value) => {
              setQuery(value)
            }}
          />
          <InputGroup.Button
            onClick={async () => {
              console.log(query);
              await searchQuery(query)
              setQuery("")
            }}
          >
            <SearchIcon />
          </InputGroup.Button>
        </InputGroup>

      <Table
      loading={loading}
      headerHeight={65}
      height={400}
      width={820}
      data={data}
      hover={true}
      onRowClick={rowData => {
        console.log(rowData);
      }}
    >
      <Column width={150} align="center" fixed>
        <HeaderCell>Food</HeaderCell>
        <Cell dataKey="name" />
      </Column>

      <Column width={200} align="center">
        <HeaderCell>
          <HeaderSummary title="❤️ Calories" summary={calories} />
        </HeaderCell>
        <Cell dataKey="calories" />
      </Column>

      <Column width={90} align="center">
        <HeaderCell>
         <HeaderSummary title="Protein(g)" summary={proteins}/> 
        </HeaderCell>
        <Cell dataKey="protein" />
      </Column>

      <Column width={90} align="center">
      <HeaderCell>
         <HeaderSummary title="Carb(g)" summary={carbs}/> 
      </HeaderCell>
        <Cell dataKey="carbs_g" />
      </Column>

      <Column width={100} align="center">
      <HeaderCell>
         <HeaderSummary title="Fat(g)" summary={fats}/> 
      </HeaderCell>
        <Cell dataKey="fat" />
      </Column>

      <Column width={100} align="center">
        <HeaderCell>Sugar(g)</HeaderCell>
        <Cell dataKey="sugar_g" />
      </Column>

      <Column width={110} align="center">
        <HeaderCell>Serving Size(g)</HeaderCell>
        <Cell dataKey="serving_size_g" />
      </Column>

      <Column width={80} fixed="right" align='center'>
        <HeaderCell></HeaderCell>

        <Cell style={{ padding: '6px' }}>
          {rowData => (
            <IconButton icon={<TrashIcon style={{ color: 'hotpink' }} />} onClick={async () => await delete_item(rowData.name)}/>
          )}
        </Cell>
      </Column>
    </Table>
      </div>
    </div>
  );
}

export default App;
