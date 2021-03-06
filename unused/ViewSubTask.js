import React from "react";
import {
  Container,
  Header,
  Divider,
  Segment,
  Progress,
  Responsive,
  Label,
  Card
} from "semantic-ui-react";

class ViewTask extends React.Component {
  constructor(props){
    super(props);
  }
  state = {
    loading: true,
    task: [],
    tasks: [],
    profile: [{
      data_inregistrare: "2019-05-19 00:00:00",
      email: "test3@yahoo.com",
      nume: "nume3",
      parola: "ghfhgfff",
      position: "tester",
      prenume: "prenume3",
    }],
  };

  async componentDidMount() {
    const url = "http://vvtsoft.ddns.net:5123/tasks/5ce1712510ecd1095a50fa01";
    const response = await fetch(url);
    const data = await response.json();
    this.setState({ task: data, loading: false });
    const urltasks = "http://vvtsoft.ddns.net:5123/tasks";
    const responsetasks = await fetch(urltasks);
    const datatasks = await responsetasks.json();
    this.setState({ tasks: datatasks, loading: false });
    for (let i = 0; i < this.state.task.participants.length; i++) {
      const urlprofile =
        "http://localhost:8081/get-profile/" +
        this.state.task.participants[i]._id;
      fetch(urlprofile)
        .then(data => {
          return data.json();
        }).then((res)=>{
          this.setState({ loading: false });
          this.state.profile.push(res[1][0]);
          return (
            "http://localhost:8081/get-position/" +
            this.state.task.participants[i]._id
          );
        })
        .then((url)=>{
          fetch(url)
          .then((data) => {
            return data.json();
          })
          .then((res)=>{
            if(this.state.profile[i]!=undefined){
              this.state.profile[i].position = res[1].position;
              this.forceUpdate()
            }
          })
        })
    }
  }
  render() {
    return (
      <div>
        {" "}
        {this.state.loading || !this.state.task ? (
          <div>Task Not Found</div>
        ) : (
          <div className="ViewTask">
            <Container textAlign="justified">
              <Divider horizontal>
                <Header as="h1">{this.state.task.name}</Header>
              </Divider>

              <Segment color="yellow">
                <Label ribbon="left">
                  <Header as="h1">{this.state.task.priority}</Header>
                </Label>

                <Divider horizontal>
                  <Segment.Group horizontal>
                    <Responsive as={Segment}>
                      {this.state.task.department}
                    </Responsive>
                    <Responsive as={Segment}>
                      {this.state.task.deadline}
                    </Responsive>
                    <Responsive as={Segment}>
                      {this.state.task.category}
                    </Responsive>
                  </Segment.Group>
                </Divider>
                <Divider horizontal>
                  <Segment>
                    <Header as="h4">{this.state.task.creator}</Header>
                  </Segment>
                </Divider>
                <Divider hidden />
                <Progress percent={0} active color="yellow">
                  {this.state.task.status}
                </Progress>
                <Divider hidden />
                <Divider horizontal>
                  <Header as="h3">Description</Header>
                </Divider>
                <Divider hidden />
                <p>{this.state.task.description}</p>

                <Divider hidden />
                <Divider horizontal>
                  <Header as="h3">Sub-Tasks</Header>
                </Divider>
                <Divider hidden />
                <Card.Group>
                  <Card>
                    <Card.Content>
                      <Card.Header>Sub-Task Name</Card.Header>
                      <Card.Meta>Deadline</Card.Meta>
                      <Card.Meta>Priority</Card.Meta>
                      <Card.Meta>Status</Card.Meta>
                    </Card.Content>
                  </Card>
                  <Card>
                    <Card.Content>
                      <Card.Header>Sub-Task Name</Card.Header>
                      <Card.Meta>Deadline</Card.Meta>
                      <Card.Meta>Priority</Card.Meta>
                      <Card.Meta>Status</Card.Meta>
                    </Card.Content>
                  </Card>
                </Card.Group>
                <Divider hidden />
                <Divider horizontal>
                  <Header as="h3">Participants</Header>
                </Divider>
                <Divider hidden />
                <Label.Group size="large">
                  {this.state.profile.map(data => {
                    return (
                      <Label className="ParticipantsLabel" as="a" color="blue" image>
                        {data.nume} {data.prenume}
                        <Label.Detail>{data.position}</Label.Detail>
                      </Label>
                    );
                  })}
                </Label.Group>
              </Segment>
            </Container>
          </div>
        )}
      </div>
    );
  }
}

export default ViewTask;
