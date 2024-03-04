import React from 'react';
import './feedback.css';

// ...rest of the ContactForm component...

class ContactForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fname: '',
            lname: '',
            email: '',
            message: '',
        };
    }

    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here (e.g., send data to your server)
        console.log(this.state);
    }

    render() {
        return (
            <div className='feedback-form'>
            <form onSubmit={this.handleSubmit}>
                <label>
                    First Name:
                    <input className='feedback-input' type="text" name="fname" onChange={this.handleInputChange} />
                </label>
                <label>
                    Last Name:
                    <input className='feedback-input' type="text" name="lname" onChange={this.handleInputChange} />
                </label>
                <label>
                    Email:
                    <input className='feedback-input' type="email" name="email" onChange={this.handleInputChange} />
                </label>
                <label>
                    Message:
                    <textarea className='feedback-message' name="message" onChange={this.handleInputChange} />
                </label>
                <input className='feedback-submit feedback-input' type="submit" value="Submit" />
            </form>
            </div>
        );
    }
}

export default ContactForm;