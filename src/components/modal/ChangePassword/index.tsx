import React, { useEffect, useRef, useState } from 'react'
import './ChangePassword.scss'
import { Button, Form, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { Blocks } from 'react-loader-spinner';
import { LensTwoTone } from '@mui/icons-material';

const ModalChangePassword = (props) => {

  const { par_show, outChange } = props;

  const [show, setShow] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState(false);

  const refPasswordInput = useRef<HTMLInputElement | null>(null);
  
  useEffect(()=>{
    if (refPasswordInput.current){
      refPasswordInput.current.focus();
      refPasswordInput.current.select();
    }
  })
  useEffect(()=>{
    setShow(par_show ?? false)
    
  }, [par_show])

  const handleHide = () => {
      // event ketika klik di luar modal
  }

  const handleClick_ChangePWD = (show:boolean, tipe:'changePWD') => {
      if (tipe == 'changePWD'){
        setShow(show);
        outChange({tipe:'close_modal', value: show, form:'changePWD'});
      }
  }

  return (
    <>

        {/* MODAL CHANGE PASSWORD */}
        <Modal 
                show = {show}
              // show={this.state.modal.changePWD.show} 
                centered = {true}
                size="sm"
                backdrop={true}
                onHide={handleHide}
        >

            <Modal.Header className='modalheader modal-change-password'>
                <Modal.Title className='dashboard-modal-title' >
                    <FontAwesomeIcon icon = {faKey} className='login-dropdown-icon' color={'darkgreen'} 
                        style = {{position:'absolute', right:15, top:25, zIndex:0, transform:`scale(2)`}}/>
                    {/* <img src = {PassPNG} width = {80} height = {80}
                        style = {{position:'absolute', zIndex:0, top:-30, right:0}}/> */}
                    
                    {/* <FontAwesomeIcon icon = {faKey} color = {"green"}/> */}
                    <span className='login-icon-modal-title'>Change Password</span>

                    {/* TES DOWNLOAD FILE */}
                    {/* <a href = "http://192.168.1.120:3007/download" download> Download </a> */}
                </Modal.Title>
                {/* <span className='dashboard-modal-close'
                  onClick={()=>this.handleClick_ChangePWD(false,'changePWD')}>X</span> */}
            </Modal.Header>

            <Modal.Body>

                <div className='d-flex justify-content-center align-items-center'>
                    <Blocks
                          height="100"
                          width="100"
                          wrapperStyle={{}}
                          wrapperClass=""
                          visible={loaderStatus}
                          ariaLabel="blocks-wrapper"
                    />
                </div>

                {
                    !loaderStatus
                    &&
                    <div
                        style={{display: loaderStatus ? 'none' : 'block'}}>
                        {/* <Form.Group className='mb-2' controlId='formBasicOldPasssword'>
                            <Form.Label className='mb-1 dash-modal-form-label required'>Current Password</Form.Label>
                            <Form.Control type = "password" className='modal-input-placeholder' placeholder="Enter Current Password" 
                                // onChange={(event)=>this.handleChangePassword(event, 'oldPass')}
                                />
                        </Form.Group> */}
                        <Form.Group className='mb-2' controlId='formBasicNewPasssword'>
                            <Form.Label className='mb-1 dash-modal-form-label required'>New Password</Form.Label>
                            <Form.Control type = "password" className='modal-input-placeholder' 
                                  ref={refPasswordInput} 
                                  placeholder="Enter New Password" 
                                // onChange={(event)=>this.handleChangePassword(event, 'newPass')}
                                />
                        </Form.Group>
                        <Form.Group className='mb-2' controlId='formBasicConfirmNewPasssword'>
                            <Form.Label className='mb-1 dash-modal-form-label required'>Confirm New Password</Form.Label>
                            <Form.Control type = "password" className='modal-input-placeholder' placeholder="Confirm New Password" 
                                // onChange={(event)=>this.handleChangePassword(event, 'confirmNewPass')}
                                />
                        </Form.Group>
                    </div>
                }
            </Modal.Body>

            <Modal.Footer>
                <Button variant = "secondary" 
                      onClick={()=>handleClick_ChangePWD(false,'changePWD')} disabled={loaderStatus}
                      >Close</Button>
                <Button variant = "primary" 
                      // onClick={()=>this.handleSavePassword()} disabled={this.state.modal.changePWD.loader}
                      >Save</Button>
            </Modal.Footer>

        </Modal>
    </>
  )
}

export default ModalChangePassword