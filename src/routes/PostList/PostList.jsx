import React from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import styles from './PostList.css';
import {Table, Card, Button, Icon} from 'antd';
import moment from 'moment';

const {Column} = Table;

function PostList({
    dispatch,
    postsList,
    paging,
    loading
}) {
    const columnProps = {
        title: 'posts',
        key: 'posts',
        render: (text, record) => {
            const {
                post_id,
                descendants,
                author,
                created_at,
                title
            } = record;

            return (<Link to={`/posts/${post_id}`}>
                <Card>
                    <div className={styles.cardContent}>
                        <span className={styles.commentNumber}>{descendants.length}</span>
                        <span>
                            <h3>{title}</h3>
                            <p>By <em>{author.username}</em> | {moment(created_at).fromNow()}</p>
                        </span>
                    </div>
                </Card>
            </Link>);
        }
    };

    const pagination = {
        total: paging.total,
        pageSize: paging.per_page,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10'],
        showQuickJumper: true,
        onChange: nextPage => {
            dispatch({
                type: 'posts/fetchPostsList',
                payload: {
                    pageInfo: {
                        limit: 5,
                        page: nextPage
                    }
                }
            });
        },
        onShowSizeChange: (current, size) => {
            dispatch({
                type: 'posts/fetchPostsList',
                payload: {
                    pageInfo: {
                        limit: size,
                        page: current
                    }
                }
            });
        }
    };

    const tableProps = {
        dataSource: postsList,
        showHeader: false,
        rowKey: 'post_id',
        pagination,
        loading,
        title: () => <div>
            <Button type="primary" size="large" icon="addfile" className={styles.addPost}>Add Post</Button>
            <h1><Icon type="file-text" className={styles.icon}/>Posts</h1>
        </div>
    };

    return (
        <Table {...tableProps}>
            <Column {...columnProps}/>
        </Table>
    );
}

function mapStateToProps(state) {
    return {
        ...state.posts,
        loading: state.loading.models.posts,
    };
}

export default connect(mapStateToProps)(PostList);
