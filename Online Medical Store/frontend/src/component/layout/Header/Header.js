import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
  // const dispatch = useDispatch();
  // const [keyword, setKeyword] = useState("");
  // const searchHandler = (event)=>{
  //   event.preventDefault();
  //   dispatch(getProduct(keyword));
  // }
  // const setKeywordHandler = (event)=>{
  //   setKeyword(event.target.value);
  // }
  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Container fluid>
        <Navbar.Brand href="#">Medical Store</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/products">Products</Nav.Link>
            <Nav.Link href="/contact">Contact</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
          </Nav>
          {/* <Form className="d-flex" onSubmit={searchHandler()}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              onChange={setKeywordHandler}
            />
            <Button variant="outline-success">Search</Button>
          </Form> */}

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;