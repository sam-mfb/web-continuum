let flames = [
  0x5a,
  0xac,
  0x5a,
  0x54,
  0x38,
  0x08,
  0x10,
  0x80,
  0x6c,
  0xb4,
  0xc8,
  0x50,
  0x50,
  0x20,
  0x40,
  0xa8,
  0x7a,
  0x94,
  0x68,
  0x50,
  0x40,
  0x80,
  0x70,
  0xa8,
  0x54,
  0x98,
  0x60,
  0x80,
  0x30,
  0x14,
  0x4c,
  0x36,
  0x4a,
  0x58,
  0x80,
  0x00,
  0x10,
  0x28,
  0x34,
  0x4c,
  0x54,
  0xaa,
  0x08,
  0x10,
  0x2c,
  0x58,
  0x2c,
  0xea,
  0x14,
  0x00,
  0x0c,
  0x14,
  0x68,
  0x9c,
  0x64,
  0x1a,
  0x0a,
  0x14,
  0x6e,
  0xba,
  0x24,
  0x1a,
  0x04,
  0x1a,
  0x64,
  0x9c,
  0x68,
  0x14,
  0x0c,
  0x00,
  0x14,
  0xea,
  0x2c,
  0x58,
  0x2c,
  0x10,
  0x08,
  0xaa,
  0x54,
  0x4c,
  0x34,
  0x28,
  0x10,
  0x00,
  0x80,
  0x58,
  0x4a,
  0x36,
  0x4c,
  0x14,
  0x30,
  0x80,
  0x60,
  0x98,
  0x54,
  0xa8,
  0x70,
  0x80,
  0x40,
  0x50,
  0x68,
  0x94,
  0x7a,
  0xa8,
  0x40,
  0x20,
  0x50,
  0x50,
  0xc8,
  0xb4,
  0x6c,
  0x80,
  0x10,
  0x08,
  0x38,
  0x54,
  0x5a,
  0xac,
  0x5a,
  0x08,
  0x14,
  0x14,
  0x2a,
  0x5a,
  0x6c,
  0x02,
  0x04,
  0x14,
  0x2c,
  0x52,
  0xbc,
  0x2a,
  0x04,
  0x02,
  0x0c,
  0x32,
  0x54,
  0x2a,
  0x1c,
  0x02,
  0x02,
  0x34,
  0xa4,
  0xd8,
  0x64,
  0x50,
  0x18,
  0xaa,
  0x54,
  0x64,
  0x58,
  0x28,
  0x10,
  0x00,
  0x50,
  0xae,
  0x68,
  0x34,
  0x68,
  0x10,
  0x20,
  0xb0,
  0x4c,
  0x72,
  0x2c,
  0x50,
  0x60,
  0x00,
  0x40,
  0xb0,
  0x48,
  0xba,
  0xec,
  0x50,
  0xa0,
  0x00,
  0x60,
  0x50,
  0x2c,
  0x72,
  0x4c,
  0xb0,
  0x20,
  0x10,
  0x68,
  0x34,
  0x68,
  0xae,
  0x50,
  0x00,
  0x10,
  0x28,
  0x58,
  0x64,
  0x54,
  0xaa,
  0x18,
  0x50,
  0x64,
  0xd8,
  0xa4,
  0x34,
  0x02,
  0x02,
  0x1c,
  0x2a,
  0x54,
  0x32,
  0x0c,
  0x02,
  0x04,
  0x2a,
  0xbc,
  0x52,
  0x2c,
  0x14,
  0x04,
  0x02,
  0x6c,
  0x5a,
  0x2a,
  0x14,
  0x14,
  0x08
]

/*
int xbshotstart[BUNKKINDS][16] = 
{	{2, 13, 18, 22, 24, 21, 16, 10, -2, -13, -18, -22, -24, -21, -16, -10},
	{0, 3, 15, 31, 24, 31, 17, 3, 0, -3, -15, -31, -24, -31, -17, -3},
	{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0},
	{-4,-4,-4,-4,-4,-4,-4,-4,-4,-4,-4,-4,-4,-4,-4,-4},
	{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}
	
};
int ybshotstart[BUNKKINDS][16] =
{	{-24, -21, -16, -10, 2, 13, 18, 22, 24, 21, 16, 10, -2, -13, -18, -22},
	{-24, -31, -17, -3, 0, 3, 15, 31, 24, 31, 17, 3, 0, -3, -15, -31},
	{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0},
	{-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3},
	{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}
};

int xbcenter[BUNKKINDS][16] =
{	{24, 24, 24, 23, 22, 22, 22, 24, 24, 24, 24, 25, 26, 26, 26, 24},
	{25, 22, 21, 14, 10, 13, 18, 22, 23, 26, 27, 34, 38, 35, 30, 26},
	{24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24},
	{24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24},
	{24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24}
	
};
int ybcenter[BUNKKINDS][16] =
{	{26, 26, 26, 24, 24, 24, 24, 23, 22, 22, 22, 24, 24, 24, 24, 25},
	{38, 35, 30, 26, 25, 22, 21, 14, 10, 13, 18, 22, 23, 26, 27, 34},
	{24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24},
	{24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24},
	{24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24}
};


    */

const strafe_defs = [
  0x24,
  0x95,
  0x5a,
  0x3c,
  0x3c,
  0x00,
  0x00,
  0x00,
  0x48,
  0x2b,
  0x3c,
  0x3f,
  0x0c,
  0x00,
  0x00,
  0x00,
  0x24,
  0x15,
  0x1a,
  0x1e,
  0x0d,
  0x00,
  0x00,
  0x00,
  0x0a,
  0x0a,
  0x1c,
  0x1f,
  0x0c,
  0x0e,
  0x01,
  0x00,

  0x02,
  0x04,
  0x19,
  0x1e,
  0x1c,
  0x1b,
  0x04,
  0x02,
  0x00,
  0x01,
  0x0e,
  0x0c,
  0x1f,
  0x1c,
  0x0a,
  0x0a,
  0x00,
  0x00,
  0x00,
  0x0d,
  0x1e,
  0x1a,
  0x15,
  0x24,
  0x00,
  0x00,
  0x00,
  0x0c,
  0x3f,
  0x3c,
  0x2b,
  0x48,

  0x00,
  0x00,
  0x00,
  0x3c,
  0x3c,
  0x5a,
  0x95,
  0x24,
  0x00,
  0x00,
  0x00,
  0x30,
  0xfd,
  0x3c,
  0xd4,
  0x12,
  0x00,
  0x00,
  0x00,
  0xb0,
  0x78,
  0x78,
  0xa4,
  0x24,
  0x00,
  0x80,
  0x70,
  0x30,
  0xf8,
  0x38,
  0x50,
  0x50,

  0x40,
  0x20,
  0x98,
  0x78,
  0x38,
  0xd8,
  0x20,
  0x40,
  0x50,
  0x50,
  0x38,
  0xf8,
  0x30,
  0x70,
  0x80,
  0x00,
  0x24,
  0xa4,
  0x78,
  0x78,
  0xb0,
  0x00,
  0x00,
  0x00,
  0x12,
  0xd4,
  0x3c,
  0xfd,
  0x30,
  0x00,
  0x00,
  0x00
]

export { flames, strafe_defs }
