import { useState } from "react";
import styles from './ReplyForm.module.css';
import { Button } from "antd";
const ReplyForm = ({ onSubmit }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ email, name });
    };
  
    return (
        <div className={`row`} style={{margin:'5px'}}>
        <div className={`col-xs-4 col-xs-offset-4`}>
          <div className={styles['floating-label-group']}>
            <input
              type="text"
              id="name"
              className={`form-control ${styles.input}`}
              autoComplete="off"
              autoFocus
              required
              onChange={(e)=>setName(e.target.value)}
            />
            <label className={styles['floating-label']}>Name</label>
          </div>
  
          <div className={styles['floating-label-group']}>
            <input
              type="text"
              id="email"
              className={`form-control ${styles.input}`}
              autoComplete="off"
              required
              onChange={(e)=>setEmail(e.target.value)}
            />
            <label className={styles['floating-label']}>Email</label>
          </div>
          <div>
            <Button style={{minWidth:'188px', borderRadius:'24px', backgroundColor:'black', color:'white'}} onClick={handleSubmit}>
                Submit
            </Button>
          </div>
        </div>
      </div>
    );
  };
  export default ReplyForm;