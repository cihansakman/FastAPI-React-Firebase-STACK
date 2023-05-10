
import React from 'react';
import { useState, useEffect } from "react";
import "./App.css";
import axios from 'axios';
import { Input, InputGroup } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import { Table, Button } from 'rsuite';


const { Column, HeaderCell, Cell } = Table;
const styles = {
  width: 630,
  height: 40,
  marginBottom: 10,
};

const data2 = [
  {
    id: 1,
    email: 'Leora13@yahoo.com',
    firstName:
      'Red Wacky League AntlezBroketheStereoNeon Kitching Josh Bennett Evolution Dreams 红色古怪联盟丹尼尔梅斯马修',
    lastName: 'Schuppe',
    city: 'New Gust',
    companyName: 'Lebsack - Nicolas'
  },
  {
    id: 2,
    email: 'Mose_Gerhold51@yahoo.com',
    firstName: 'Janis',
    lastName: 'Bode',
    city: 'New Gust',
    companyName: 'Glover - Hermiston'
  },
  {
    id: 3,
    city: 'New Gust',
    email: 'Frieda.Sauer61@gmail.com',
    firstName: 'Makenzie Vandervort',
    lastName: null,
    companyName: 'Williamson - Kassulke'
  },
  {
    id: 4,
    email: 'Eloisa.OHara@hotmail.com',
    firstName: 'Ciara',
    lastName: 'Towne',
    city: 'Vandervort',
    companyName: 'Hilpert, Eichmann and Brown'
  }
];



function App() {

  const [query, setQuery] = useState("")
  const [data, setData] = useState([])


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
  },[])

  async function delete_item(item_name){
    await axios.delete('http://localhost:8000/api/item', { data: { title: item_name }})
    .then(response => console.log(response))
    .catch(error => console.log(error));
  }

  async function searchQuery(searched_query){
    await axios.post('http://localhost:8000/api/item', { query: searched_query })
    .then(response => console.log(response))
    .catch(error => console.log(error));
  }

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
          marginBottom:"30px"

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
      height={400}
      width={630}
      data={data}
      onRowClick={rowData => {
        console.log(rowData);
      }}
    >
      <Column width={150} align="center" fixed>
        <HeaderCell>Food</HeaderCell>
        <Cell dataKey="name" />
      </Column>

      <Column width={100}>
        <HeaderCell>Protein(g)</HeaderCell>
        <Cell dataKey="protein" />
      </Column>

      <Column width={100}>
        <HeaderCell>Calories</HeaderCell>
        <Cell dataKey="calories" />
      </Column>

      <Column width={100}>
        <HeaderCell>Serving Size(g)</HeaderCell>
        <Cell dataKey="serving_size_g" />
      </Column>

      <Column width={100}>
        <HeaderCell>Fat(g)</HeaderCell>
        <Cell dataKey="fat" />
      </Column>

      <Column width={80} fixed="right">
        <HeaderCell>...</HeaderCell>

        <Cell style={{ padding: '6px' }}>
          {rowData => (
            <Button appearance="link" onClick={async () => await delete_item(rowData.name)}>
              Delete
            </Button>
          )}
        </Cell>
      </Column>
    </Table>
      </div>
    </div>
  );
}

export default App;
