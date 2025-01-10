import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '../features/authSlice';
import { fetchPreferences, updatePreference } from '../features/ecommerceSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const PreferenceButtons = ({ bookId }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const authTokens = useSelector((state) => state.auth.authTokens);
    const { preferences, status } = useSelector((state) => state.ecommerce);

    const [userId, setUserId] = useState('');
    const [isBuyer, setIsBuyer] = useState(false);
    const [currentPreference, setCurrentPreference] = useState(null);

    // Fetch user details if not available
    useEffect(() => {
        if (authTokens && !user) {
            dispatch(fetchUserDetails());
        }
        if (user) {
            setUserId(user.id);
            if (!user.is_staff) {
                setIsBuyer(true);
            }
        }
    }, [authTokens, dispatch, user]);

    // Fetch all preferences for the user
    useEffect(() => {
        if (isBuyer && user && status=='idle' ) {
            dispatch(fetchPreferences());
        }
    }, [dispatch, isBuyer, status, user]);

    // Update currentPreference for the current book
    useEffect(() => {
        if (preferences && preferences.length > 0) {
            const bookPreference = preferences.find((pref) => pref.book === bookId);
            setCurrentPreference(bookPreference || null);
        }
    }, [preferences, bookId]);

    // Handle like or dislike action
    const handlePreference = (preference) => {
        // const newPreference = currentPreference?.preference === preference ? null : preference;
        dispatch(updatePreference({ userId, bookId, preference: preference }));
    };
    console.log("currentPreference: ",currentPreference)
    return (
        <div className="d-flex gap-3 mt-3">
            {/* Like Button */}
            <div
                className={`d-flex align-items-center justify-content-center ${currentPreference?.preference === 'like' ? 'text-success' : 'text-secondary'}`}
                style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                onClick={() => handlePreference('like')}
            >
                <FontAwesomeIcon icon={faThumbsUp} />
            </div>

            {/* Dislike Button */}
            <div
                className={`d-flex align-items-center justify-content-center ${currentPreference?.preference === 'dislike' ? 'text-danger' : 'text-secondary'}`}
                style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                onClick={() => handlePreference('dislike')}
            >
                <FontAwesomeIcon icon={faThumbsDown} />
            </div>
        </div>
    );
};

export default PreferenceButtons;
