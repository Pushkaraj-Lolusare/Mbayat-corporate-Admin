import React from "react";
import ReactEcharts from "echarts-for-react";
import "echarts-gl";
import LogoiCON from "../../assets/images/logo-icon.svg";
import PageHeader from "../../components/PageHeader";
import {
  topProductOption,
  sparkleCardData, totalSubscriber,
} from "../../Data/DashbordData";
import SparkleCard from "../../components/SparkleCard";
import MysteryBoxTable from "../Tables/dashboard/mysteryBoxTable";
import VendorPaymentTable from "../Tables/dashboard/vendorPaymentTable";
import {getDashboardData} from "../../services/userServices/userService";

var timer = null;
class Dashbord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardData: [],
      chartData: {},
    };
  }
  async componentDidMount() {
    window.scrollTo(0, 0);
    await this.loadDashboardData();
  }

  loadDashboardData = async () => {
    const get = await getDashboardData();
    if(get.status === "success"){
      this.setState({
        cardData: [...get.data.cardData],
        chartData: get.data.chartData,
      });
    }else{
      this.setState({
        cardData: [],
        chartData: {},
      });
    }
  }

  // chartPlace = () => {
  //   var chartDom = document.getElementById("topsaleDonut");
  //   var myChart = echarts.init(chartDom);
  //   var option;
  //   option = saleGaugeOption;
  //
  //   option && myChart.setOption(option);
  // };
  // async loadDataCard() {
  //   const { cardData } = this.state;
  //   var allCardData = cardData;
  //   cardData.map((data, i) => {
  //     var uData = [];
  //     data.sparklineData.data.map((d, j) => {
  //       uData[j] = Math.floor(Math.random() * 10) + 1;
  //     });
  //     allCardData[i].sparklineData.data = [...uData];
  //   });
  //   this.setState({ cardData: [...allCardData] });
  // }

  render() {
    const { loadingPage } = this.props;
    const { cardData } = this.state;
    if (loadingPage) {
      return (
        <div className="page-loader-wrapper">
          <div className="loader">
            <div className="m-t-30">
              <img src={LogoiCON} width="48" height="48" alt="Lucid" />
            </div>
            <p>Please wait...</p>
          </div>
        </div>
      );
    }
    return (
      <div
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="Dashboard"
              Breadcrumb={[{ name: "Dashboard" }]}
            />
            <div className="row clearfix">
              {cardData.map((data, i) => (
                <SparkleCard
                  index={i}
                  key={data.heading}
                  Heading={data.heading}
                  Money={data.money}
                  PerText={data.perText}
                  isRandomUpdate={true}
                  // Data={data.sparklineData}
                  mainData={data.sparklineData.data}
                  chartColor={data.sparklineData.areaStyle.color}
                  ContainerClass="col-lg-3 col-md-6 col-sm-6"
                />
              ))}
            </div>

            <div className="row clearfix">
              <div className="col-lg-6 col-md-12">
                <div className="card">
                  <div className="header">
                    <h2>Total Sales</h2>
                  </div>
                  <div className="body">
                    <ReactEcharts
                      option={this.state.chartData}
                      opts={{ renderer: "svg" }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12">
                {/*<div className="card">*/}
                {/*  <div className="header">*/}
                {/*    <h2>Total Sales</h2>*/}
                {/*  </div>*/}
                {/*  <div className="body">*/}
                {/*    <ReactEcharts*/}
                {/*        option={totalSubscriber}*/}
                {/*        opts={{ renderer: "svg" }}*/}
                {/*    />*/}
                {/*  </div>*/}
                {/*</div>*/}
              </div>
              <div className="col-lg-12 col-md-12">
                <MysteryBoxTable />
              </div>
              <div className="col-md-12">
                <VendorPaymentTable />
              </div>
              {/*<div className="col-lg-3 col-md-6">*/}
              {/*  <ReferralsCard />*/}
              {/*</div>*/}
              {/*<div className="col-lg-3 col-md-6">*/}
              {/*  <div className="card">*/}
              {/*    <div className="header">*/}
              {/*      <h2>Total Revenue</h2>*/}
              {/*      <Dropdown as="ul" className="header-dropdown">*/}
              {/*        <Dropdown.Toggle*/}
              {/*          variant="success"*/}
              {/*          as="li"*/}
              {/*          id="dropdown-basic"*/}
              {/*        >*/}
              {/*          <Dropdown.Menu*/}
              {/*            as="ul"*/}
              {/*            className="dropdown-menu dropdown-menu-right"*/}
              {/*          >*/}
              {/*            <li>*/}
              {/*              <a>Action</a>*/}
              {/*            </li>*/}
              {/*            <li>*/}
              {/*              <a>Another Action</a>*/}
              {/*            </li>*/}
              {/*            <li>*/}
              {/*              <a>Something else</a>*/}
              {/*            </li>*/}
              {/*          </Dropdown.Menu>*/}
              {/*        </Dropdown.Toggle>*/}
              {/*      </Dropdown>*/}
              {/*    </div>*/}
              {/*    <div className="body text-center">*/}
              {/*      <h4 className="margin-0">Total Sale</h4>*/}
              {/*      <div*/}
              {/*        id="topsaleDonut"*/}
              {/*        style={{ height: 125, width: "100%" }}*/}
              {/*      ></div>*/}
              {/*      <ReactEcharts*/}
              {/*        option={topRevenueOption}*/}
              {/*        opts={{ renderer: "svg" }}*/}
              {/*        style={{*/}
              {/*          height: "35px",*/}
              {/*          marginLeft: "35%",*/}
              {/*          marginRight: "35%",*/}
              {/*          bottom: 0,*/}
              {/*          top: 0,*/}
              {/*        }} // use svg to render the chart.*/}
              {/*      />*/}
              {/*      <h6 className="p-b-15">Weekly Earnings</h6>*/}
              {/*      <div className="sparkline">*/}
              {/*        <ReactEcharts*/}
              {/*          option={topRevenueMonthlyOption}*/}
              {/*          opts={{ renderer: "svg" }} // use svg to render the chart.*/}
              {/*          style={{*/}
              {/*            height: "35px",*/}
              {/*            marginLeft: "25%",*/}
              {/*            marginRight: "25%",*/}
              {/*            bottom: 0,*/}
              {/*            top: 0,*/}
              {/*          }}*/}
              {/*        />*/}
              {/*      </div>*/}
              {/*      <h6>Monthly Earnings</h6>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashbord;
// const mapStateToProps = ({
//   loginReducer,
//   navigationReducer,
//   analyticalReducer,
// }) => ({
//   email: loginReducer.email,
//   menuArrowToggle: navigationReducer.menuArrowToggle,
//   sparkleCardData: analyticalReducer.sparkleCardData,
//   topProductDropDown: analyticalReducer.topProductDropDown,
//   referralsDropDown: analyticalReducer.referralsDropDown,
//   recentChatDropDown: analyticalReducer.recentChatDropDown,
//   facebookShowProgressBar: analyticalReducer.facebookShowProgressBar,
//   twitterShowProgressBar: analyticalReducer.twitterShowProgressBar,
//   affiliatesShowProgressBar: analyticalReducer.affiliatesShowProgressBar,
//   searchShowProgressBar: analyticalReducer.searchShowProgressBar,
//   loadingPage: analyticalReducer.loadingPage,
// });
//
// export default connect(mapStateToProps, {
//   toggleMenuArrow,
//   loadSparcleCard,
//   onPressTopProductDropDown,
//   onPressReferralsDropDown,
//   onPressRecentChatDropDown,
//   onPressDataManagedDropDown,
//   facebookProgressBar,
//   twitterProgressBar,
//   affiliatesProgressBar,
//   searchProgressBar,
// })();
