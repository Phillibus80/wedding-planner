import {Field, useFormikContext} from "formik";
import PropTypes from "prop-types";
import {Col, Container, Image, Row} from "react-bootstrap";

import styles from "../adminImage/AdminImage.module.scss";
import ImageInput from "../imageInput/ImageInput.jsx";

const ImageLoaderField = ({onChange, images}) => {
    const {
        values,
        errors,
        touched,
        setFieldValue
    } = useFormikContext();

    const onUpdate = async e => {
        onChange(e);
        await setFieldValue('image_src', `/img/page-img/${e.target.value}`);
    }

    const imageSource = values?.file_src
        ? `/api/img/page-img/${values?.file_src?.name}`
        : `/api${values.image_src}`;

    return (
        <>
            <label>
                <p>Select an Image:</p>
                <Row className='mb-3'>
                    <Field
                        as="select"
                        className={styles.image_input}
                        value={values.imageOptions}
                        name="imageOptions"
                        disabled={!!values.file_src}
                        onChange={onUpdate}
                    >
                        <option value="">(Select an image)</option>
                        {
                            images.length > 0 &&
                            images?.map(
                                ({src: img_src}) => (
                                    <option
                                        value={`${img_src.replace('./img/page-img/', '')}`}
                                        key={`${img_src}`}
                                    >
                                        {img_src.replace('./img/page-img/', '')}
                                    </option>
                                )
                            )
                        }
                    </Field>
                </Row>

                <Row className='mb-3'>
                    <Field
                        disabled={!!values.imageOptions}
                        type="input"
                        value={values.file_src}
                        name="file_src"
                        className={styles.image_input}
                        component={ImageInput}
                        aria-label={`A button to update the image.`}
                        setFieldValue={setFieldValue}
                    />

                    {errors.image_src && touched.image_src ? (
                        <div className="u-error-text">{errors.image_src}</div>
                    ) : null}
                </Row>
            </label>

            <Col className='gap-0'>
                <Container>
                    <Row>
                        <Image
                            className={styles.image_container_image}
                            src={imageSource}
                            alt={values.image_alt}
                            aria-label={values.image_alt}
                            loading="lazy"
                            fluid
                        />
                    </Row>
                </Container>
            </Col>
        </>
    )
};


ImageLoaderField.propTypes = {
    onChange: PropTypes.func,
    images: PropTypes.array
};

export default ImageLoaderField;