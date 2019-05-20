import React from "react";
import { BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import {
    Button,
    Container,
    List,
    Tab,
    Image,
    Segment,
    Grid,
    Header,
    Divider,
    Progress,
    Dropdown,
    Modal,
    Table
} from "semantic-ui-react";
import Cookies from "universal-cookie";
import MyHeader from "../../../Header";
import ProgressButton from "./ProgressButton.js";
import axios from "axios";
const baseurl = "http://localhost:8081";

const selectOptions = [
    {
        key: "Relaxed",
        text: "Relaxed",
        value: "Relaxed"
    },
    {
        key: "Focused",
        text: "Focused",
        value: "Focused"
    },
    {
        key: "Tired",
        text: "Tired",
        value: "Tired"
    }
];

class ViewProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            name: "",
            surname: "",
            email: "",
            job: "",
            employees: []
        };
    }
    componentDidMount() {
        //get cookies
        var cookies = new Cookies();
        this.setState({
            id: cookies.get("user_id")
        });
        this.forceUpdate();
        console.log("State is : ", this.state.id, "=", cookies.get("user_id"));
        if (
            cookies.get("user_id") != undefined &&
            cookies.get("user_id") != null &&
            cookies.get("user_id") != ""
        ) {
            console.log("ITS NOT NULL!!!!!!!!", this.state.id);
            console.log("http://localhost:8081/get-profile/" + cookies.get("user_id"));
            fetch("http://localhost:8081/get-profile/" + cookies.get("user_id"))
                .then(response => {
                    return response.json();
                })
                .then(response => {
                    console.log("response is", response[1][0]);
                    this.setState({
                        name: response[1][0].nume,
                        surname: response[1][0].prenume,
                        email: response[1][0].email
                    });
                    //il punem in state
                    fetch("http://localhost:8081/viewUnderlings/" + cookies.get("user_id"))
                        .then(responsee => {
                            return responsee.json();
                        })
                        .then(responsee => {
                            this.setState({
                                employees: responsee[1]
                            });
                            console.log("State is ", this.state);
                        });
                });
        } else {
            return <Redirect to="/login" href="/login" />;
        }
    }
    render() {
        var listEmployees = () => {
            if (this.state.employees != null) {
                this.state.employees.map(function(item, i) {
                    return (
                        <Table.Body color="red">
                            <Table.Row>
                                <Table.Cell>
                                    <Header as="h4" image>
                                        <Image
                                            src="https://steamuserimages-a.akamaihd.net/ugc/960838928914191885/31FF51C2135DAD7CB3BF2A2F2142DF0D2177A113/?imw=1024&imh=1024&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"
                                            rounded
                                            size="mini"
                                        />
                                        <Header.Content>Oancea Ionut Eugen</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell>
                                    {
                                        JSON.stringify(item)
                                            .split(/"position":"/)[1]
                                            .split(/"/)[0]
                                    }
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    );
                });
            }
        };
        return (
            <Tab.Pane>
                <Container textAlign="justified">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={5} textAlign="center">
                                <Image
                                    src="https://steamuserimages-a.akamaihd.net/ugc/960838928914191885/31FF51C2135DAD7CB3BF2A2F2142DF0D2177A113/?imw=1024&imh=1024&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"
                                    alt="avatar"
                                    size="small"
                                    centered
                                />
                            </Grid.Column>

                            <Grid.Column className="profileData">
                                {/* <Divider hidden /> */}
                                <Segment.Group>
                                    <Segment>
                                        <Header as="h4">Name : {this.state.name}</Header>
                                    </Segment>
                                    <Segment>
                                        <Header as="h4">Surname: {this.state.surname}</Header>
                                    </Segment>
                                    <Segment>
                                        <Header as="h4">Email : {this.state.email}</Header>
                                    </Segment>
                                    <Segment>
                                        <Header as="h4">Job : {this.state.job} </Header>
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h4" attached="top">
                                    Your Tasks
                                </Header>
                                <Segment color="red" secondary attached>
                                    Planurile tale
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h4" attached="top">
                                    Preferences
                                </Header>
                                <Segment color="green" secondary attached>
                                    <List horizontal divided relaxed>
                                        <List.Item>
                                            <List.Content>Morning: Focused</List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Content>Evening: Tired</List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Content>Noon: Relaxed</List.Content>
                                        </List.Item>
                                    </List>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Table color="teal" key="teal">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Employee</Table.HeaderCell>
                                        <Table.HeaderCell>Job</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                {listEmployees}
                            </Table>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Tab.Pane>
        );
    }
}

class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            email: "",
            description: "",
            jobName: "",
            myFunction: "",
            category: ""
        };
    }
    changeHandler = e => {
        this.setState({ [e.target.name]: e.target.value });
    };
    componentWillUnmount() {
        if (
            this.state.userName ||
            this.state.email ||
            this.state.description ||
            this.state.jobName ||
            this.state.myFunction ||
            this.state.category
        ) {
            const create = {
                username: this.state.userName,
                email: this.state.email,
                description: this.state.description,
                job: {
                    name: this.state.jobName,
                    function: this.state.myFunction,
                    category: this.state.category
                }
            };
            const cookies = new Cookies();
            const userId = cookies.get("user_id");
            axios
                .post(`${baseurl}/edit-profile/${userId}/`, { create })
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
    render() {
        const { userName, email, description, jobName, myFunction, category } = this.state;
        return (
            <Tab.Pane>
                {" "}
                <Container textAlign="justified">
                    <Segment.Group>
                        <Segment color="red">
                            <Header as="h4">Change Name:</Header>
                            <div className="ui fluid icon input">
                                <i aria-hidden="true" className="users icon" />
                                <input
                                    name="name"
                                    type="text"
                                    value={userName}
                                    placeholder="Change Name..."
                                    onChange={this.changeHandler}
                                />
                            </div>
                        </Segment>
                        <Segment color="red">
                            <Header as="h4">Change Surname:</Header>
                            <div className="ui fluid icon input">
                                <i aria-hidden="true" className="users icon" />
                                <input
                                    name="Surname"
                                    type="text"
                                    value={userName}
                                    placeholder="Change Surname..."
                                    onChange={this.changeHandler}
                                />
                            </div>
                        </Segment>
                        <Segment color="red">
                            <Header as="h4">Change Email:</Header>
                            <div className="ui fluid icon input">
                                <input
                                    name="email"
                                    type="text"
                                    value={email}
                                    placeholder="Change Email..."
                                    onChange={this.changeHandler}
                                />
                                <i aria-hidden="true" className="mail icon" />
                            </div>
                        </Segment>

                        <Segment color="red" secondary>
                            <Grid>
                                <Grid.Column width={8}>
                                    <Header as="h4" attached="top">
                                        Preferences
                                    </Header>
                                    <Segment attached color="red">
                                        <List divided relaxed>
                                            <List.Item>
                                                <List.Content>
                                                    <List.Header>Morning</List.Header>
                                                    <Dropdown
                                                        placeholder="Select Difficulty"
                                                        fluid
                                                        selection
                                                        options={selectOptions}
                                                        onChange={this.changeHandler}
                                                    />
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Content>
                                                    <List.Header>Afternoon</List.Header>
                                                    <Dropdown
                                                        placeholder="Select Difficulty"
                                                        fluid
                                                        selection
                                                        options={selectOptions}
                                                        onChange={this.changeHandler}
                                                    />
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Content>
                                                    <List.Header>Evening</List.Header>
                                                    <Dropdown
                                                        placeholder="Select Difficulty"
                                                        fluid
                                                        selection
                                                        options={selectOptions}
                                                        onChange={this.changeHandler}
                                                    />
                                                </List.Content>
                                            </List.Item>
                                        </List>
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <Header as="h4" attached="top">
                                        Job
                                    </Header>
                                    <Segment attached color="red">
                                        <List divided relaxed>
                                            <List.Item>
                                                <List.Content>
                                                    <List.Header>Job Name</List.Header>
                                                    <div className="ui fluid icon input">
                                                        <input
                                                            name="jobName"
                                                            type="text"
                                                            value={jobName}
                                                            placeholder="Change Job Name..."
                                                            onChange={this.changeHandler}
                                                        />
                                                    </div>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Content>
                                                    <List.Header>Function</List.Header>
                                                    <div className="ui fluid icon input">
                                                        <input
                                                            name="myFunction"
                                                            type="text"
                                                            value={myFunction}
                                                            placeholder="Change Function..."
                                                            onChange={this.changeHandler}
                                                        />
                                                    </div>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Content>
                                                    <List.Header>Category</List.Header>
                                                    <div className="ui fluid icon input">
                                                        <input
                                                            name="category"
                                                            type="text"
                                                            value={category}
                                                            placeholder="Change Category..."
                                                            onChange={this.changeHandler}
                                                        />
                                                    </div>
                                                </List.Content>
                                            </List.Item>
                                        </List>
                                    </Segment>
                                </Grid.Column>
                            </Grid>
                        </Segment>
                    </Segment.Group>
                </Container>
            </Tab.Pane>
        );
    }
}

class Profile extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div
                className="Profile"
                onLoad={() => {
                    console.log("Profile");
                }}
            >
                <MyHeader />
                <Divider hidden />
                <Container textAlign="justified">
                    <Segment color="red">
                        <Tab
                            menu={{ secondary: true, pointing: true }}
                            panes={[
                                {
                                    menuItem: "Profile Information",
                                    render: () => <ViewProfile />
                                },
                                {
                                    menuItem: "Edit Information",
                                    render: () => <EditProfile />
                                }
                            ]}
                        />
                    </Segment>
                </Container>
            </div>
        );
    }
}

export default Profile;
