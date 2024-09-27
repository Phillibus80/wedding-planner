import PropTypes from "prop-types";
import {useState} from "react";

import styles from './ToggleSwitch.module.scss';

const ToggleSwitch = ({labelText, callbackHandler, isShowingSection}) => {
    const [toggleState, setToggleState] = useState(isShowingSection);
    const updateToggleState = () => setToggleState(!toggleState);

    return (
        <label className={styles.toggle}>
            <input
                className={styles.toggle_checkbox}
                type="checkbox"
                onChange={callbackHandler}
                onClick={updateToggleState}
                checked={toggleState}
            />
            <div className={styles.toggle_switch}/>
            <span className={styles.toggle_label}>{labelText}</span>
        </label>
    );
}

ToggleSwitch.propTypes = {
    callbackHandler: PropTypes.func,
    isShowSection: PropTypes.bool,
    isShowingSection: PropTypes.bool,
    labelText: PropTypes.string
};

export default ToggleSwitch;