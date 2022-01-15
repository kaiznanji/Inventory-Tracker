import React, { useEffect, useState } from 'react';
import { Table , Button, ToggleButton, Form, Col, Row, Modal } from 'react-bootstrap'

import { INVENTORY_URL } from '../utils/constants'
import { axiosRequest } from '../utils/api'


function Inventory() {
    const [data, setData] = useState([]);
    const [query, setQuery] = useState({ sort: "", desc: false, regexName: "", minPrice: null, maxPrice: null, minQuantity: null, maxQuantity: null });
    const [tags, setTags] = useState({ T365: false, T366: false, T367: false })
    const [url, setUrl] = useState(INVENTORY_URL + "/inventory")
    const [showEdit, setEditShow] = useState(false);
    const handleEditClose = () => setEditShow(false);
    const [showCreate, setCreateShow] = useState(false);
    const handleCreateClose = () => setCreateShow(false);
    const handleCreateShow = () => setCreateShow(true);
    const [currentItem, setItem] = useState({ _id: "", name: "", purchaseCost: null, quantity: null, tags: { T365: false, T366: false, T367: false } })
    

    function handleShow(obj) {
        let newtags = { T365: false, T366: false, T367: false };
        setEditShow(true);
        for (const tag in obj.tags) {
            newtags[obj.tags[tag]] = true;
        }
        obj.tags = newtags;
        setItem(obj);
        
    } 

    // Handling creating an item
    function handleCreate() {
        axiosRequest(INVENTORY_URL + "/inventory/create", "POST", currentItem)
            .then((response) => { 
                if (response.status === 200) {
                    handleCreateClose();
                    window.location.reload();
                }
            })
            .catch((error) => {
                alert(error.response.data);
            })
    }

    // Handle saving changes to editing an item
    function handleEdit() {
        axiosRequest(INVENTORY_URL + "/inventory/edit", "POST", currentItem)
            .then((response) => { 
                if (response.status === 200) {
                    handleEditClose();
                    window.location.reload();
                }
            })
            .catch((error) => {
                alert(error.response.data);
            })
    }

    // Handle deleting an item
    function del(id) {
        axiosRequest(INVENTORY_URL + "/inventory/delete", "DELETE", { _id: id })
            .then((response) => { 
                if (response.status === 200) {
                    window.location.reload();
                }
            })
            .catch((error) => {
                alert(error.response.data);
            })
    }

    // Handle search submit
    async function handleSubmit(e) {
        e.preventDefault()
        let queryCount = 0;
        let url = INVENTORY_URL + "/inventory";
        // add url query paramaters
        for (const key in query) {
            if (query[key] !== null && query[key] !== false && query[key] !== "") {
                if (queryCount === 0) {
                    url += "?" + key + "=" + query[key];
                    ++queryCount;
                } else {
                    url += "&" + key + "=" + query[key];
                } 
            }
        }

        // add tags
        for (const key in tags) {
            if (tags[key]) {
                if (queryCount === 0) {
                    url += "?tags=" + key;
                    ++queryCount;
                } else {
                    url += "&tags=" + key;
                } 
            }
        }
        setUrl(url);
    }

    useEffect(() => {
        // Handle fetching inventory data
        axiosRequest(url, "GET")
            .then((response) => { return response.data })
            .then((data) => {
                setTimeout(()=>{
                    setData(data);
                }, 100);
                
            })
            .catch((error) => {
                alert(error.response.data)
            })

            
    }, [url])
    return (
        <>
            <div className="d-grid gap-2">
                    <Button size="lg" variant="primary" onClick={handleCreateShow}>
                        Create Item
                    </Button>
                </div>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} md="4">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={query.regexName}
                        onChange={e => setQuery({ ...query, regexName: e.target.value })}
                    />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                    <Form.Label>Minimum Price</Form.Label>
                    <Form.Control
                        type="text"
                        value={query.minPrice}
                        onChange={e => setQuery({ ...query, minPrice: e.target.value })}
                    />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                    <Form.Label>Maximum Price</Form.Label>
                    <Form.Control
                        type="text"
                        value={query.maxPrice}
                        onChange={e => setQuery({ ...query, maxPrice: e.target.value })}
                    />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="formBasicSelect">
                        <Form.Label>Sort</Form.Label>
                        <Form.Control
                        as="select"
                        value={query.sort}
                        onChange={e => setQuery({ ...query, sort: e.target.value })}
                        >
                        <option value="">None</option>
                        <option value="name">Item Name</option>
                        <option value="quantity">Quantity</option>
                        <option value="purchaseCost">Cost</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                    <Form.Label>Minimum Quantity</Form.Label>
                    <Form.Control
                        type="text"
                        value={query.minQuantity}
                        onChange={e => setQuery({ ...query, minQuantity: e.target.value })}
                    />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                    <Form.Label>Maximum Quantity</Form.Label>
                    <Form.Control
                        type="text"
                        value={query.maxQuantity}
                        onChange={e => setQuery({ ...query, maxQuantity: e.target.value })}
                    />
                    </Form.Group>
                </Row>
                
                    <Form.Label>Tags</Form.Label>
                    <ToggleButton 
                        className="mb-1"
                        id="toggle-check-1"
                        type="checkbox"
                        variant="outline-primary"
                        checked={tags.T365}
                        onChange={e => setTags({ ...tags, T365: e.target.checked })}
                    >
                        T365
                    </ToggleButton>
                    <ToggleButton 
                        className="mb-1"
                        id="toggle-check-2"
                        type="checkbox"
                        variant="outline-primary"
                        checked={tags.T366}
                        onChange={e => setTags({ ...tags, T366: e.target.checked })}
                    >
                        T366
                    </ToggleButton>
                    <ToggleButton 
                        className="mb-1"
                        id="toggle-check-3"
                        type="checkbox"
                        variant="outline-primary"
                        checked={tags.T367}
                        onChange={e => setTags({ ...tags, T367: e.target.checked })}
                    >
                        T367
                    </ToggleButton>
                
                <Form.Group className="mb-3">
                    <Form.Check
                    label="Sort by descending order"
                    value={query.desc}
                    onChange={e => setQuery({ ...query, desc: e.target.checked })}
                    />
                </Form.Group>
                <Button type="submit">Search</Button>
                </Form>
            
            <Table stripped bordered hover size="sm">
            <thead>
                <tr>
                <th width="170">Item Name</th>
                <th width="170">Quantity</th>
                <th width="170">Cost</th>
                <th width="1450">Tags</th>
            
                </tr>
            </thead>
            <tbody>
            {data.map((item)=>{
                // Change tags to js object if it is a list
                let tags;
                if ((!!item.tags) && (item.tags.constructor === Array)) {
                    tags = { T365: false, T366: false, T367: false };
                    for (const tag in item.tags) {
                        tags[item.tags[tag]] = true;
                    }
                } else {
                    tags = item.tags;
                }
                const { _id, name, quantity, purchaseCost } = item;
                return (
                    <>
                    <tr>
                    <td>{name}</td>
                    <td>{quantity}</td>
                    <td>{"$ " + purchaseCost}</td>
                    <td>{Object.keys(tags).map(function(key, index) {
                        if (tags[key]) {
                            return (
                                <Button variant="info">
                                    {key}
                                    <td></td>
                                </Button>
    
                            )
                        } else {
                            return (<></>);
                        }
                     })}</td>
                    <td width="150">
                        <Button variant="primary" onClick={() => handleShow(item)}>Edit</Button> 
                    </td>
                    <td width="150">
                        <Button variant="danger" onClick={() => del(_id)}>Delete</Button> 
                    </td>
                
                    </tr>
            </>
            )})
            }
            </tbody>
            </Table>
            <Modal show={showEdit} onHide={handleEditClose}>
                <Modal.Header closeButton>
                <Modal.Title>Edit Inventory Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="formBasicSelect">
                        <Form.Label>Item Name</Form.Label>
                        <Form.Control
                        type="text"
                        value={currentItem.name}
                        onChange={e => setItem({ ...currentItem, name: e.target.value })}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                        type="text"
                        value={currentItem.quantity}
                        onChange={e => setItem({ ...currentItem, quantity: e.target.value })}
                    />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="text"
                        value={currentItem.purchaseCost}
                        onChange={e => setItem({ ...currentItem, purchaseCost: e.target.value })}
                    />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                <Form.Label>Tags</Form.Label>
                    <ToggleButton 
                        className="mb-1"
                        id="toggle-check-4"
                        type="checkbox"
                        variant="outline-primary"
                        checked={currentItem.tags.T365}
                        onChange={e => setItem({ ...currentItem, tags: { ...currentItem.tags, T365: e.target.checked } })}
                    >
                        T365
                    </ToggleButton>
                    <ToggleButton 
                        className="mb-1"
                        id="toggle-check-5"
                        type="checkbox"
                        variant="outline-primary"
                        checked={currentItem.tags.T366}
                        onChange={e => setItem({ ...currentItem, tags: { ...currentItem.tags, T366: e.target.checked } })}
                    >
                        T366
                    </ToggleButton>
                    <ToggleButton 
                        className="mb-1"
                        id="toggle-check-6"
                        type="checkbox"
                        variant="outline-primary"
                        checked={currentItem.tags.T367}
                        onChange={e => setItem({ ...currentItem, tags: { ...currentItem.tags, T367: e.target.checked } })}
                        
                    >
                        T367
                    </ToggleButton>
                </Row>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleEditClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleEdit}>
                    Save Changes
                </Button>
                </Modal.Footer>
                </Modal>


                <Modal show={showCreate} onHide={handleCreateClose}>
                <Modal.Header closeButton>
                <Modal.Title>Create Inventory Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="formBasicSelect">
                        <Form.Label>Item Name</Form.Label>
                        <Form.Control
                        type="text"
                        value={currentItem.name}
                        onChange={e => setItem({ ...currentItem, name: e.target.value })}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                        type="text"
                        value={currentItem.quantity}
                        onChange={e => setItem({ ...currentItem, quantity: e.target.value })}
                    />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="text"
                        value={currentItem.purchaseCost}
                        onChange={e => setItem({ ...currentItem, purchaseCost: e.target.value })}
                    />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                <Form.Label>Tags</Form.Label>
                    <ToggleButton 
                        className="mb-1"
                        id="toggle-check-7"
                        type="checkbox"
                        variant="outline-primary"
                        checked={currentItem.tags.T365}
                        onChange={e => setItem({ ...currentItem, tags: { ...currentItem.tags, T365: e.target.checked } })}
                    >
                        T365
                    </ToggleButton>
                    <ToggleButton 
                        className="mb-1"
                        id="toggle-check-8"
                        type="checkbox"
                        variant="outline-primary"
                        checked={currentItem.tags.T366}
                        onChange={e => setItem({ ...currentItem, tags: { ...currentItem.tags, T366: e.target.checked } })}
                    >
                        T366
                    </ToggleButton>
                    <ToggleButton 
                        className="mb-1"
                        id="toggle-check-9"
                        type="checkbox"
                        variant="outline-primary"
                        checked={currentItem.tags.T367}
                        onChange={e => setItem({ ...currentItem, tags: { ...currentItem.tags, T367: e.target.checked } })}
                        
                    >
                        T367
                    </ToggleButton>
                </Row>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCreateClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleCreate}>
                    Create
                </Button>
                </Modal.Footer>
                </Modal>
        </>

    )
}

export default Inventory;
