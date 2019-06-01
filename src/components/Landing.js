import React, { Component } from "react";
// import logo from './logo.svg';
import { Layout, DatePicker, Table } from "antd";
import moment from "moment";
import axios from "axios";
import "./landing.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
const { RangePicker } = DatePicker;

const { Content } = Layout;

export default class Landing extends Component {
  state = {
    pagination: { pageSize: 5 },
    highestDate: null,
    lowestDate: null,
    disabledDate: false,

    tableChartData: null,
    data: [
      {
        timestamp: "2019-04-10",
        game: "Callbreak Multiplier",
        revenue: 25,
        impressions: 1040555
      },
      {
        timestamp: "2019-04-10",
        game: "World Cricket Championship",
        revenue: 150,
        impressions: 1140555
      },
      {
        timestamp: "2019-04-11",
        game: "Callbreak Multiplier",
        revenue: 140,
        impressions: 1240000
      },
      {
        timestamp: "2019-04-11",
        game: "World Cricket Championship",
        revenue: 130,
        impressions: 1100666
      },
      {
        timestamp: "2019-04-12",
        game: "Callbreak Multiplier",
        revenue: 150,
        impressions: 1345222
      },
      {
        timestamp: "2019-04-12",
        game: "World Cricket Championship",
        revenue: 76,
        impressions: 1000111
      },
      {
        timestamp: "2019-04-13",
        game: "Callbreak Multiplier",
        revenue: 50,
        impressions: 1046123
      },
      {
        timestamp: "2019-04-13",
        game: "World Cricket Championship",
        revenue: 300,
        impressions: 5280000
      },
      {
        timestamp: "2019-04-14",
        game: "Callbreak Multiplier",
        revenue: 50,
        impressions: 1111222
      },
      {
        timestamp: "2019-04-14",
        game: "World Cricket Championship",
        revenue: 110,
        impressions: 1240555
      },
      {
        timestamp: "2019-04-15",
        game: "Callbreak Multiplier",
        revenue: 95,
        impressions: 1240555
      },
      {
        timestamp: "2019-04-15",
        game: "World Cricket Championship",
        revenue: 75,
        impressions: 1240555
      },
      {
        timestamp: "2019-04-16",
        game: "Callbreak Multiplier",
        revenue: 85,
        impressions: 1240555
      },
      {
        timestamp: "2019-04-16",
        game: "World Cricket Championship",
        revenue: 150,
        impressions: 1240555
      },
      {
        timestamp: "2019-04-17",
        game: "Callbreak Multiplier",
        revenue: 100,
        impressions: 1240555
      },
      {
        timestamp: "2019-04-17",
        game: "World Cricket Championships",
        revenue: 200,
        impressions: 1240555
      },
      {
        timestamp: "2019-04-18",
        game: "Callbreak Multiplier",
        revenue: 500,
        impressions: 5940555
      },
      {
        timestamp: "2019-04-18",
        game: "World Cricket Championship",
        revenue: 120,
        impressions: 1240555
      },
      {
        timestamp: "2019-04-19",
        game: "Callbreak Multiplier",
        revenue: 150,
        impressions: 1240555
      },
      {
        timestamp: "2019-04-19",
        game: "World Cricket Championship",
        revenue: 100,
        impressions: 1240555
      }
    ]
  };
  componentDidMount() {
    const url = "http(s)://www.mocky.io/v2/5cd04a20320000442200fc10";
    let params = {
      method: "GET",
      url: url,
      headers: { "Access-Control-Allow-Origin": "*" }
    };

    axios(params)
      .then(responseData => {
        console.log(responseData);
        let res = responseData.map((data, index) => {
          let obj = { ...data };
          let eCPM = (obj.revenue / obj.impressions) * 1000;
          obj["eCPM"] = eCPM;
          return obj;
        });
        responseData.sort(function(a, b) {
          var date1 = new Date(a.timestamp);
          var date2 = new Date(b.timestamp);
          return date1 - date2;
        });

        var highestDate = responseData[this.state.data.length - 1].timestamp;
        console.log(highestDate);

        var lowestDate = responseData[0].timestamp;
        console.log(lowestDate);
        console.log(res);
        const pager = { ...this.state.pagination };
        pager.total = res.length;
        this.setState({
          data: res,
          lowestDate: lowestDate,
          highestDate: highestDate,
          tableChartData: res,
          pagination: pager
        });
      })
      .catch(err => {
        let responseData = [...this.state.data];
        let res = responseData.map((data, index) => {
          let obj = { ...data };
          let eCPM = (obj.revenue / obj.impressions) * 1000;
          obj["eCPM"] = eCPM.toFixed(3);
          return obj;
        });
        responseData.sort(function(a, b) {
          var date1 = new Date(a.timestamp);
          var date2 = new Date(b.timestamp);
          return date1 - date2;
        });

        var highestDate = responseData[this.state.data.length - 1].timestamp;
        // console.log(highestDate);

        var lowestDate = responseData[0].timestamp;
        // console.log(lowestDate);
        // console.log(res);
        const pager = { ...this.state.pagination };
        pager.total = res.length;
        this.setState({
          data: res,
          lowestDate: lowestDate,
          highestDate: highestDate,
          tableChartData: res,
          pagination: pager
        });
      });
  }
  onChange = (date, dateString) => {
    console.log(date, dateString);
    let data = [...this.state.data];
    let modifyData = data.filter(
      val => val.timestamp >= dateString[0] && val.timestamp <= dateString[1]
    );
    console.log(modifyData);
    const pager = { ...this.state.pagination };
    pager.total = modifyData.length;
    this.setState({ tableChartData: modifyData, pagination: pager });
  };

  disabledDate = current => {
    // console.log(
    //   `current: ${current} and  ${current <
    //     new Date(this.state.lowestDate)} and date: ${moment(
    //     this.state.lowestDate
    //   )}`
    // );
    return (
      current < moment(this.state.lowestDate) ||
      current > moment(this.state.highestDate)
    );
  };
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.total = this.state.tableChartData.length;
    this.setState({
      pagination: pager
    });
  };
  render = () => {
    const columns = [
      {
        title: "timestamp",
        dataIndex: "timestamp"
      },
      {
        title: "game",
        dataIndex: "game"
      },
      {
        title: "revenue",
        dataIndex: "revenue"
      },
      {
        title: "eCPM",
        dataIndex: "eCPM"
      },
      {
        title: "impressions",
        dataIndex: "impressions"
      }
    ];

    return (
      <Layout>
        <Content
          style={{
            background: "#F3F9FB",
            padding: 24,
            margin: 0
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <RangePicker
              onChange={this.onChange}
              disabledDate={this.disabledDate}
              defaultValue={[moment("2019-04-10"), moment("2019-04-19")]}
            />
          </div>

          <LineChart
            width={600}
            height={300}
            data={this.state.tableChartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="timestamp" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="eCPM" stroke="#82ca9d" />
          </LineChart>

          <Table
            columns={columns}
            rowKey="eCPM"
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
            dataSource={this.state.tableChartData}
          />
        </Content>
      </Layout>
    );
  };
}
