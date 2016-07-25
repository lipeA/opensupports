const React = require('react');
const Reflux = require('reflux');
const _ = require('lodash');
const classNames = require('classnames');

const UserActions = require('actions/user-actions');
const UserStore = require('stores/user-store');

const Button = require('core-components/button');
const Form = require('core-components/form');
const Input = require('core-components/input');
const Checkbox = require('core-components/checkbox');
const Widget = require('core-components/widget');
const WidgetTransition = require('core-components/widget-transition');

let MainHomePageLoginWidget = React.createClass({
    
    mixins: [Reflux.listenTo(UserStore, 'onUserStoreChanged')],

    getInitialState() {
        return {
            sideToShow: 'front',
            loginFormErrors: {}
        };
    },

    render() {
        return (
            <WidgetTransition sideToShow={this.state.sideToShow} className={classNames('login-widget--container', this.props.className)}>
                {this.renderLogin()}
                {this.renderPasswordRecovery()}
            </WidgetTransition>
        );
    },

    renderLogin() {
        return (
            <Widget className="main-home-page--widget" title="Login">
                <Form className="login-widget--form" ref="loginForm" onSubmit={this.handleLoginFormSubmit} errors={this.state.loginFormErrors} onValidateErrors={this.handleLoginFormErrorsValidation}>
                    <div className="login-widget--inputs">
                        <Input placeholder="email" name="email" className="login-widget--input" validation="EMAIL" required/>
                        <Input placeholder="password" name="password" className="login-widget--input" password required/>
                        <Checkbox name="remember" label="Remember Me" className="login-widget--input"/>
                    </div>
                    <div className="login-widget--submit-button">
                        <Button type="primary">LOG IN</Button>
                    </div>
                </Form>
                <Button className="login-widget--forgot-password" type="link" onClick={this.handleForgotPasswordClick}>
                    {'Forgot your password?'}
                </Button>
            </Widget>
        );
    },

    renderPasswordRecovery() {
        return (
            <Widget className="main-home-page--widget main-home-page--password-widget" title="Password Recovery">
                <Form className="login-widget--form" onSubmit={this.handleForgotPasswordSubmit}>
                    <div className="login-widget--inputs">
                        <Input placeholder="email" name="email" className="login-widget--input" validation="EMAIL"/>
                    </div>
                    <div className="login-widget--submit-button">
                        <Button type="primary">Recover my password</Button>
                    </div>
                </Form>
                <Button className="login-widget--forgot-password" type="link" onClick={this.handleBackToLoginClick}>
                    {'Back to login form'}
                </Button>
            </Widget>
        );
    },

    handleLoginFormSubmit(formState) {
        UserActions.login(formState);
    },

    handleForgotPasswordSubmit() {

    },

    handleLoginFormErrorsValidation(errors) {
        this.setState({
            loginFormErrors: errors
        });
    },

    handleForgotPasswordClick() {
        this.setState({
            sideToShow: 'back'
        });
    },

    handleBackToLoginClick() {
        this.setState({
            sideToShow: 'front'
        });
    },
    
    onUserStoreChanged(event) {
        if (event === 'LOGIN_FAIL') {
            this.setState({
                loginFormErrors: {
                    password: 'Password does not match'
                }
            }, function () {
                this.refs.loginForm.refs.password.focus()
            }.bind(this));
        }
    }
});

export default MainHomePageLoginWidget;