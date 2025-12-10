import React, { useState } from 'react'
import {
  Box, Drawer, AppBar, CssBaseline, Toolbar, List,
  Typography, Divider, ListItem, ListItemButton,
  ListItemIcon, ListItemText, IconButton, Menu, MenuItem,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import DiscountIcon from '@mui/icons-material/Percent'; // MUI v5 có icon này, nếu không có dùng khác
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaComment } from 'react-icons/fa';

const drawerWidth = 240;
const collapsedWidth = 60;

export default function ClippedDrawer({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const mainItems = [
    { text: 'Tổng quan', icon: <DashboardIcon />, path: '/tongquan' },
    { text: 'Sản phẩm', icon: <InventoryIcon />, path: '/products-manager' },
    { text: 'Danh mục', icon: <CategoryIcon />, path: '/categories-manager' },
    { text: 'Thương hiệu', icon: <BrandingWatermarkIcon />, path: '/brands-manager' },
    { text: 'Đơn hàng', icon: <ShoppingCartIcon />, path: '/order-manager' },
    { text: 'Đánh giá', icon: <FaComment/>, path:'/reviews-manager'},
    { text: 'Nhân viên', icon: <PeopleIcon />, path: '/employee-manager' },
    { text: 'Khách hàng', icon: <PeopleIcon />, path: '/customer-manager' },
    { text: 'Mã giảm giá', icon: <DiscountIcon />, path: '/discount-manager' },
    { text: 'Thống kê', icon: <BarChartIcon />, path: '/analytics' },
  ];

  const accountItems = [
    { text: 'Hồ sơ cá nhân', icon: <AccountCircleIcon />, path: '/my-profile' },
    { text: 'Đơn hàng của tôi', icon: <ShoppingCartIcon />, path: '/my-orders' },
    { text: 'Địa chỉ giao hàng', icon: <LocalShippingIcon />, path: '/my-address' },
    { text: 'Bảo mật', icon: <LockIcon />, path: '/security' },
  ];

  const [open, setOpen] = React.useState(() => {
    const saved = localStorage.getItem('sidebar-open');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const toggleDrawer = () => {
    setOpen((prev) => {
      localStorage.setItem('sidebar-open', JSON.stringify(!prev));
      return !prev;
    });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleAccountClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmed) {
      localStorage.removeItem('MANAGER_user');
      localStorage.removeItem('MANAGER_token');
      setUser(null);
      toast.info('Bạn đã đăng xuất tài khoản');
      navigate('/login-manager');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>

          <IconButton color="inherit" onClick={handleAccountClick}>
            <AccountCircleIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => navigate('/my-profile')}>Trang cá nhân</MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : collapsedWidth,
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
          },
        }}
        open={open}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {mainItems.map((item) => {
              const isSelected = location.pathname.startsWith(item.path);
              return (
                <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                  <Tooltip title={!open ? item.text : ''} placement="right" arrow>
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      selected={isSelected}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                          color: isSelected ? 'primary.main' : 'inherit',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>

          <Divider sx={{ my: 1 }} />

          <List>
            {accountItems.map((item) => {
              const isSelected = location.pathname.startsWith(item.path);
              return (
                <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                  <Tooltip title={!open ? item.text : ''} placement="right" arrow>
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      selected={isSelected}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                          color: isSelected ? 'primary.main' : 'inherit',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
