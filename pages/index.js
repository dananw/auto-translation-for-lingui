import React, {useState, useEffect, useRef} from 'react'
import dynamic from 'next/dynamic'
import { Container, Row, Col, Button, Form, FormGroup, Input, Label, ButtonGroup, ButtonToolbar, Modal, ModalHeader, ModalBody, ModalFooter  } from 'reactstrap';
import {translateAPI, IsValidJSONString} from '../lib/index'
const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });
import example from '../data/example.json'

const Index = ({}) => {
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('id')
  const [objSource, setObjSource] = useState({})
  const [translateValue, setTranslateValue] = useState({})
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const fileInput = useRef(null);
  
  const triggerInputFile = () => {
    fileInput.current.click()
  }

  const onChangeHandler = (event) => {
    let reader = new FileReader()
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0])
  }

  const onChangeSelection = (event) => {
    setTargetLang(event.target.value)
  }

  const onReaderLoad = async (event) => {
    let res = event.target.result;

    if(IsValidJSONString(res)) {
      let obj = JSON.parse(res)
      setObjSource(obj)
    }else{
      alert("JSON not valid, please check again.");
    }
      
  }

  const onTranslate = async (type) => {
    let tmp = {}
    let source = example;

    if(type !== 'example') {
      source = objSource
    }
    
    setLoading(true)
    for (let key in source) {
      const data = await translateAPI(sourceLang, targetLang, key);
      tmp[key] = data
    }
    
    setLoading(false)
    setTranslateValue(tmp)
  }

  const propsRJV = {
    theme: 'monokai',
    style: {
      border: '1px solid white',
      padding: '1rem'
    }
  }

  return(
    <Container fluid style={{marginTop: '1rem'}}>
      <h3 className="text-white">Auto Translation Tools</h3>
      <p className="text-white">This tools is create for simply translation JSON file for <a href="https://lingui.js.org/">lingui.js</a></p>
      <Row>
        <Col md="12">
          <Form>
            <FormGroup>
              <Label className="text-white">Translation Json</Label>
              <DynamicReactJson {...propsRJV} src={translateValue} />
              <input type="file" name="file" onChange={(e) => onChangeHandler(e)} ref={fileInput} style={{display: 'none'}} accept="application/JSON"/>
            </FormGroup>
          </Form>
          <Row>
            <Col>
              <FormGroup>
              <Label className="text-white">From</Label>
                <Input type="select" name="from">
                  <option value="auto">Auto Detect</option>
                </Input>              
              </FormGroup>
            </Col>
            
            <Col>
              <FormGroup>
              <Label className="text-white">Translate To</Label>
                <Input type="select" name="to" onChange={onChangeSelection}>
                  <option value="id">Indonesia</option>
                  <option value="zh">China</option>
                  <option value="de">Jerman</option>
                </Input>              
              </FormGroup>
            </Col>
          </Row>
          <ButtonToolbar>
            <ButtonGroup>
              <Button onClick={toggle}>Show example file</Button>  
              <Button color="success" onClick={() => onTranslate('example')} disabled={loading}>
                {loading ? 'Loading . . .' : 'Translate Example File'}
              </Button>
            </ButtonGroup>
            &nbsp;
            &nbsp;
            &nbsp;
            &nbsp;
            <ButtonGroup>
              <Button color="primary" onClick={() => triggerInputFile()}>Upload JSON file</Button>
              <Button color="success" onClick={onTranslate} disabled={loading}>
                {loading ? 'Loading . . .' : 'Translate'}
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
          
        </Col>
      </Row>

      <Modal isOpen={modal} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>Example Json File</ModalHeader>
        <ModalBody>
          <DynamicReactJson src={example}/>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Close</Button>
        </ModalFooter>
      </Modal>

    </Container>
  )
}

export default Index;