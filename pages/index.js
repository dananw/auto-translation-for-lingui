import React, {useState, useEffect, useRef} from 'react'
import dynamic from 'next/dynamic'
import example from '../data/example.json'
import country from '../data/country.json'
import {CopyToClipboard} from 'react-copy-to-clipboard';

import { 
  Container, 
  Row, 
  Col, 
  Button, 
  Form, 
  FormGroup, 
  Input, 
  Label, 
  ButtonGroup, 
  ButtonToolbar  
} from 'reactstrap';

import {
  translateAPI, 
  isValidJSONString, 
  toParagraph, 
  paragraphToArray, 
  isEmpty
} from '../lib/index'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });

let indexing = 0;

const Index = ({}) => {
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('af')
  const [objSource, setObjSource] = useState({})
  const [translateValue, setTranslateValue] = useState({})
  const [loading, setLoading] = useState(false)
  const [wait, setWait] = useState(false)

  const fileInput = useRef(null);
  
  useEffect(() => {
    onTranslate()
    
  }, [targetLang])
  
  const useExample = () => {
    setObjSource(example)
  }

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

    if(isValidJSONString(res)) {
      let obj = JSON.parse(res)
      setObjSource(obj)
    }else{
      alert("JSON not valid, please check again.");
    }
  }

  const onTranslate = async () => {
    if(isEmpty(objSource)) return
    if(wait) return

    if(targetLang === 'hy') {
      alert('sorry, an error occurred while translating to this language.')
      return
    }

    let tmp = {}

    setLoading(true)

    const paragraph = await toParagraph(objSource)
    const textTranslated = await translateAPI(sourceLang, targetLang, paragraph);

    // check translate failed or success, if failed will return null
    if(textTranslated) {
      const arrayTranslated = await paragraphToArray(textTranslated)
  
      for (let i in objSource) {
        indexing += 1;
        tmp[i] = arrayTranslated[indexing - 1]
      }
      setTranslateValue(tmp)
      indexing = 0;
    }else{
      alert("An error occurred while contacting the server, please try within a few minutes.")
    }

    toast.info("Please wait before next request...", {
      autoClose: 3000,
      onOpen: () => {
        setWait(true)
      },
      onClose: () => {
        setWait(false)
      }
    });

    setLoading(false)
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
      <ToastContainer pauseOnFocusLoss={false} />
      <h3 className="text-white">Auto Translation Tools</h3>
      <p className="text-white">This tools is create for simply translation JSON file for <a href="https://lingui.js.org/">lingui.js</a></p>
      <p className="text-white">Created By: <a href="https://github.com/dananw/auto-translation-for-lingui">Danan Wijaya</a></p>
      <Row>
        <Col md="12">
          <Form>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label className="text-white">Source Json</Label>
                  <DynamicReactJson {...propsRJV} src={objSource} />  
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label className="text-white">Translation Json</Label>
                  <DynamicReactJson {...propsRJV} src={translateValue} />
                </FormGroup>
              </Col>
            </Row>
            <input type="file" name="file" onChange={(e) => onChangeHandler(e)} ref={fileInput} style={{display: 'none'}} accept="application/JSON"/>
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
                <Input type="select" name="to" onChange={onChangeSelection} disabled={loading}>
                  {Object.keys(country).map((key, value) => (
                    <option key={country[key]} value={country[key]}>{key}</option>
                  ))}
                </Input>              
              </FormGroup>
            </Col>
          </Row>
          
          <Row>
            <Col md="6" sm="12">
              <ButtonToolbar>
                <ButtonGroup>
                  <Button onClick={useExample}>Use example file</Button>  
                  <Button color="primary" onClick={() => triggerInputFile()}>Upload JSON file</Button>
                  <Button color="success" onClick={onTranslate} disabled={loading}>
                    {loading ? 'Loading . . .' : 'Translate'}
                  </Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
            <Col md="6" sm="12">
              <ButtonToolbar>
                <ButtonGroup>
                  <CopyToClipboard 
                    text={JSON.stringify(translateValue, null, 2)}
                    onCopy={() => toast.success("Copied", {
                      position: toast.POSITION.BOTTOM_CENTER,
                      autoClose: 1500,
                      hideProgressBar: true,
                    })}
                  >
                    <Button color="info">Copy Translate to clipboard</Button>  
                  </CopyToClipboard>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
          </Row>
        </Col>
      </Row>

    </Container>
  )
}

export default Index;