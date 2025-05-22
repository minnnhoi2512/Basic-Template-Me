```typescript
@Module({
  controllers: [MyController],
  providers: [MyService],
})
export class MyModule {}

@Controller()
export class MyController {
  constructor(private myService: MyService) {}
}

@Injectable1()
export class MyService {}
```
