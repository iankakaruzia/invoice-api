import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import { PrismaService } from '../../prisma/prisma.service'

jest.mock('../../prisma/prisma.service', () => {
  return mockDeep<PrismaService>()
})

beforeEach(() => {
  mockReset(prismaServiceMock)
})

export const prismaServiceMock =
  PrismaService as unknown as DeepMockProxy<PrismaService>
