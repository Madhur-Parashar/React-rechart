import React, { Component } from "react";
// import logo from './logo.svg';
import { Layout, DatePicker, Table, message } from "antd";
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
    defaultDate: [],
    tableChartData: null,
    data: []
  };
  componentDidMount() {
    const url = "http://www.mocky.io/v2/5cd04a20320000442200fc10";
    let params = {
      method: "GET",
      url: url
    };

    axios(params)
      .then(responseData => {
       
        let res = responseData.data.map((data, index) => {
          let obj = { ...data };
          let eCPM = (obj.revenue / obj.impressions) * 1000;
          obj["eCPM"] = eCPM.toFixed(3);
          return obj;
        });
        res.sort(function(a, b) {
          var date1 = new Date(a.timestamp);
          var date2 = new Date(b.timestamp);
          return date1 - date2;
        });

        var highestDate = res[res.length - 1].timestamp;
 

        var lowestDate = res[0].timestamp;
       
        const pager = { ...this.state.pagination };
        pager.total = res.length;
        this.setState({
          data: res,
          lowestDate: lowestDate,
          highestDate: highestDate,
          tableChartData: res,
          pagination: pager,
          defaultDate: [moment(lowestDate), moment(highestDate)]
        });
      })
      .catch(err => {
        message.error("Check your internet connection...");
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
    this.setState({
      tableChartData: modifyData,
      pagination: pager,
      defaultDate: [moment(dateString[0]), moment(dateString[1])]
    });
  };

  disabledDate = current => {
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
      <Layout
        style={{
          background: "#F3F9FB",
          padding: 24,
          margin: 0
        }}
      >
        <Content>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="rangeSelection">Select range</div>
            <RangePicker
              onChange={this.onChange}
              disabledDate={this.disabledDate}
              value={this.state.defaultDate}
            />
          </div>

          <LineChart
            width={800}
            height={400}
            style={{ margin: "auto" }}
            data={this.state.tableChartData}
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
